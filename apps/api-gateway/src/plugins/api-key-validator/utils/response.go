package utils

import (
	"encoding/json"
	"net/http"
)

type HttpResponseHelper struct {
	writer http.ResponseWriter
}

func NewHttpResponseHelper(writer http.ResponseWriter) *HttpResponseHelper {
	return &HttpResponseHelper{writer}
}

func (helper *HttpResponseHelper) Message(code int, message string) {
	body := ErrorResponseBody{
		StatusCode: code,
		Message:    message,
	}
	jsonBytes, _ := json.Marshal(body)

	helper.writer.Header().Set("Content-Type", "application/json")
	helper.writer.WriteHeader(code)
	helper.writer.Write(jsonBytes)
}
