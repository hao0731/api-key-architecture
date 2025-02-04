package utils

import "encoding/json"

// HTTPResponseError is the error to be returned by the ErrorHTTPStatusHandler
type HTTPResponseError struct {
	Code         int    `json:"http_status_code"`
	Msg          string `json:"http_body,omitempty"`
	HTTPEncoding string `json:"http_encoding"`
}

// Error returns the error message
func (r HTTPResponseError) Error() string {
	return r.Msg
}

// StatusCode returns the status code returned by the backend
func (r HTTPResponseError) StatusCode() int {
	return r.Code
}

// Encoding returns the HTTP output encoding
func (r HTTPResponseError) Encoding() string {
	return r.HTTPEncoding
}

type ErrorResponseBody struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
}

func NewResponseError(code int, message string) HTTPResponseError {
	body := ErrorResponseBody{
		StatusCode: code,
		Message:    message,
	}
	jsonBytes, _ := json.Marshal(body)
	jsonString := string(jsonBytes)

	return HTTPResponseError{
		Code:         code,
		Msg:          jsonString,
		HTTPEncoding: "application/json",
	}
}
