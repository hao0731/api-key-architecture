package main

import (
	"api-key-validator/authn"
	"api-key-validator/authz"
	"api-key-validator/utils"
	"context"
	"errors"
	"fmt"
	"net/http"
)

// pluginName is the plugin name
var pluginName = "api-key-validator"

// HandlerRegisterer is the symbol the plugin loader will try to load. It must implement the Registerer interface
var HandlerRegisterer = registerer(pluginName)
var ModifierRegisterer = registerer(pluginName)

var authorizer *authz.Authorizer

type registerer string

func (r registerer) RegisterHandlers(f func(
	name string,
	handler func(context.Context, map[string]interface{}, http.Handler) (http.Handler, error),
)) {
	f(string(r), r.registerHandlers)
}

func (r registerer) registerAuthorizer() error {
	instance, err := authz.New()

	if err != nil {
		return err
	}

	authorizer = instance

	return nil
}

func (r registerer) registerHandlers(ctx context.Context, extra map[string]interface{}, h http.Handler) (http.Handler, error) {
	config, ok := extra[pluginName].(map[string]interface{})
	if !ok {
		return h, errors.New("configuration not found")
	}

	err := r.registerAuthorizer()

	if err != nil {
		logger.Error(err)
		return h, errors.New("authorizer init failed")
	}

	inputHeaderName, _ := config["input_header_name"].(string)
	outputHeaderName, _ := config["output_header_name"].(string)
	apiKeyValidatorUrl, _ := config["apikey_validator_url"].(string)

	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		responseHelper := utils.NewHttpResponseHelper(w)
		apiKey := req.Header.Get(inputHeaderName)

		if apiKey == "" {
			responseHelper.Message(http.StatusUnauthorized, "Your API Key is invalid.")
			logger.Info("Unauthorized request")
			return
		}

		authenticator := authn.New(apiKeyValidatorUrl)
		authenticated, err := authenticator.Authenticate(apiKey)

		if err != nil {
			responseHelper.Message(http.StatusInternalServerError, "Oops! authentication flow went wrong, please try again.")
			logger.Error("Authenticate failed.", err)
			return
		}

		if !authenticated {
			responseHelper.Message(http.StatusUnauthorized, "Your API Key is invalid.")
			logger.Info("Unauthorized request")
			return
		}

		roles, _ := authenticator.GetRoles()
		authz.SetRolesHeader(&req.Header, roles)

		owner, _ := authenticator.GetApiKeyOwner()

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

func (r registerer) authorizeFactory(extra map[string]interface{}) func(interface{}) (interface{}, error) {
	config := extra[pluginName].(map[string]interface{})
	resource, _ := config["resource"].(string)
	action, _ := config["action"].(string)

	return func(input interface{}) (interface{}, error) {
		req, ok := input.(utils.RequestWrapper)

		if !ok {
			return nil, utils.NewResponseError(http.StatusInternalServerError, "This request is an unknown type.")
		}

		roles, err := authz.GetRolesHeader(req)

		if err != nil {
			return nil, utils.NewResponseError(http.StatusInternalServerError, "The server cannot get the roles, please try again.")
		}

		authorized, _ := authorizer.Authorize(roles, resource, action)

		if !authorized {
			return nil, utils.NewResponseError(http.StatusForbidden, "You don't have the permission to access resource.")
		}

		return input, nil
	}
}

func main() {}

// This logger is replaced by the RegisterLogger method to load the one from KrakenD
var logger utils.Logger = utils.NoopLogger{}

func (registerer) RegisterLogger(v interface{}) {
	l, ok := v.(utils.Logger)
	if !ok {
		return
	}
	logger = l
	logger.Debug(fmt.Sprintf("[PLUGIN: %s] Logger loaded", HandlerRegisterer))
}
