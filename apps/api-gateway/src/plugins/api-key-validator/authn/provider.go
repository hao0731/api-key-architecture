package authn

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

type Provider struct {
	ApiEndpoint string
}

func (provider *Provider) Validate(apiKey string) (ValidateApiKeyResult, error) {
	var result ValidateApiKeyResult
	payload, _ := json.Marshal(map[string]string{"apiKey": apiKey})
	res, requestError := http.Post(provider.ApiEndpoint, "application/json", bytes.NewReader(payload))

	if requestError != nil {
		return result, requestError
	}

	body, readError := io.ReadAll(res.Body)

	if readError != nil {
		return result, readError
	}

	parseError := json.Unmarshal(body, &result)

	if parseError != nil {
		return result, parseError
	}

	res.Body.Close()

	return result, nil
}
