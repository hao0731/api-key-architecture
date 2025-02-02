package main

import (
	"api-key-validator/utils"
	"api-key-validator/validator"
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/casbin/casbin/v2"
)

// pluginName is the plugin name
var pluginName = "api-key-validator"

// HandlerRegisterer is the symbol the plugin loader will try to load. It must implement the Registerer interface
var HandlerRegisterer = registerer(pluginName)
var ModifierRegisterer = registerer(pluginName)

var enforcer *casbin.Enforcer
var roleHeader = "X-User-Roles"

type registerer string

func (r registerer) RegisterHandlers(f func(
	name string,
	handler func(context.Context, map[string]interface{}, http.Handler) (http.Handler, error),
)) {
	f(string(r), r.registerHandlers)
}

func (r registerer) registerCasbinEnforcer() error {
	instance, err := casbin.NewEnforcer("./assets/casbin/model.conf", "./assets/casbin/policy.csv")

	if err != nil {
		return err
	}

	enforcer = instance

	return nil
}

func (r registerer) registerHandlers(ctx context.Context, extra map[string]interface{}, h http.Handler) (http.Handler, error) {
	config, ok := extra[pluginName].(map[string]interface{})
	if !ok {
		return h, errors.New("configuration not found")
	}

	err := r.registerCasbinEnforcer()

	if err != nil {
		logger.Error(err)
		return h, errors.New("casbin init failed")
	}

	inputHeaderName, _ := config["input_header_name"].(string)
	outputHeaderName, _ := config["output_header_name"].(string)
	apiKeyValidatorUrl, _ := config["apikey_validator_url"].(string)

	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		apiKey := req.Header.Get(inputHeaderName)

		if apiKey == "" {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized"))
			logger.Info("Unauthorized request")
			return
		}

		authValidator := validator.New(apiKeyValidatorUrl)
		authenticated, err := authValidator.Authenticate(apiKey)

		if err != nil {
			logger.Error("Authenticate failed.", err)
			return
		}

		if !authenticated {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized"))
			logger.Info("Unauthorized request")
			return
		}

		roles, _ := authValidator.GetRoles()
		req.Header.Set(roleHeader, strings.Join(roles, ","))

		owner, _ := authValidator.GetApiKeyOwner()

		req.Header.Set(outputHeaderName, owner)
		h.ServeHTTP(w, req)
	}), nil
}

// RegisterModifiers is the function the plugin loader will call to register the
// modifier(s) contained in the plugin using the function passed as argument.
// f will register the factoryFunc under the name and mark it as a request
// and/or response modifier.
func (r registerer) RegisterModifiers(f func(
	name string,
	factoryFunc func(map[string]interface{}) func(interface{}) (interface{}, error),
	appliesToRequest bool,
	appliesToResponse bool,
)) {
	f(string(r), r.authorizeFactory, true, false)
}

// RequestWrapper is an interface for passing proxy request between the krakend pipe
// and the loaded plugins
type RequestWrapper interface {
	Params() map[string]string
	Headers() map[string][]string
	Body() io.ReadCloser
	Method() string
	URL() *url.URL
	Query() url.Values
	Path() string
}

func (r registerer) authorizeFactory(extra map[string]interface{}) func(interface{}) (interface{}, error) {
	config := extra[pluginName].(map[string]interface{})
	resource, _ := config["resource"].(string)
	action, _ := config["action"].(string)

	return func(input interface{}) (interface{}, error) {
		req, ok := input.(RequestWrapper)

		if !ok {
			return nil, errors.New("unknown request type")
		}

		headers := req.Headers()
		roleHeaders, ok := headers["X-User-Roles"]

		if !ok {
			return nil, errors.New("cannot identify roles")
		}

		roleString := roleHeaders[0]
		roles := strings.Split(roleString, ",")

		rawInputs := utils.ArrayMap(roles, func(role string) []string {
			return []string{role, resource, action}
		})
		inputs := make([][]interface{}, len(rawInputs))
		for i := range rawInputs {
			input := make([]interface{}, len(rawInputs[i]))
			for j := range rawInputs[i] {
				input[j] = rawInputs[i][j]
			}
			inputs[i] = input
		}

		results, _ := enforcer.BatchEnforce(inputs)

		authorized := false
		for _, result := range results {
			if result {
				authorized = true
				break
			}
		}

		if !authorized {
			return nil, HTTPResponseError{Code: 403, Msg: "Forbidden"}
		}

		return input, nil
	}
}

func main() {}

// This logger is replaced by the RegisterLogger method to load the one from KrakenD
var logger Logger = noopLogger{}

func (registerer) RegisterLogger(v interface{}) {
	l, ok := v.(Logger)
	if !ok {
		return
	}
	logger = l
	logger.Debug(fmt.Sprintf("[PLUGIN: %s] Logger loaded", HandlerRegisterer))
}

type Logger interface {
	Debug(v ...interface{})
	Info(v ...interface{})
	Warning(v ...interface{})
	Error(v ...interface{})
	Critical(v ...interface{})
	Fatal(v ...interface{})
}

// Empty logger implementation
type noopLogger struct{}

func (n noopLogger) Debug(_ ...interface{})    {}
func (n noopLogger) Info(_ ...interface{})     {}
func (n noopLogger) Warning(_ ...interface{})  {}
func (n noopLogger) Error(_ ...interface{})    {}
func (n noopLogger) Critical(_ ...interface{}) {}
func (n noopLogger) Fatal(_ ...interface{})    {}

// HTTPResponseError is the error to be returned by the ErrorHTTPStatusHandler
type HTTPResponseError struct {
	Code int    `json:"http_status_code"`
	Msg  string `json:"http_body,omitempty"`
}

// Error returns the error message
func (r HTTPResponseError) Error() string {
	return r.Msg
}

// StatusCode returns the status code returned by the backend
func (r HTTPResponseError) StatusCode() int {
	return r.Code
}
