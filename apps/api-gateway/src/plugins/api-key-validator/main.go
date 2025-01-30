package main

import (
	"api-key-validator/validator"
	"context"
	"errors"
	"fmt"
	"net/http"
)

// pluginName is the plugin name
var pluginName = "api-key-validator"

// HandlerRegisterer is the symbol the plugin loader will try to load. It must implement the Registerer interface
var HandlerRegisterer = registerer(pluginName)

type registerer string

func (r registerer) RegisterHandlers(f func(
	name string,
	handler func(context.Context, map[string]interface{}, http.Handler) (http.Handler, error),
)) {
	f(string(r), r.registerHandlers)
}

func (r registerer) registerHandlers(_ context.Context, extra map[string]interface{}, h http.Handler) (http.Handler, error) {
	config, ok := extra[pluginName].(map[string]interface{})
	if !ok {
		return h, errors.New("configuration not found")
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

		owner, _ := authValidator.GetApiKeyOwner()

		req.Header.Set(outputHeaderName, owner)
		h.ServeHTTP(w, req)
	}), nil
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
