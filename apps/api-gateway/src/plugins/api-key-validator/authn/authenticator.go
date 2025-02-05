package authn

import (
	"errors"
)

type Authenticator struct {
	provider   *Provider
	apiKeyInfo *ApiKey
}

func (authenticator *Authenticator) Authenticate(apiKey string) (bool, error) {
	result, err := authenticator.provider.Validate(apiKey)

	if err != nil {
		return false, err
	}

	authenticator.apiKeyInfo = &result.ApiKeyInfo

	return result.IsValid, nil
}

func (authenticator Authenticator) GetApiKeyOwner() (string, error) {
	if authenticator.apiKeyInfo == nil {
		return "", errors.New("please execute authenticate method first")
	}
	return authenticator.apiKeyInfo.OwnerId, nil
}

func (authenticator Authenticator) GetRoles() ([]string, error) {
	if authenticator.apiKeyInfo == nil {
		return []string{}, errors.New("please execute authenticate method first")
	}
	return authenticator.apiKeyInfo.Roles, nil
}

func New(apiEndpoint string) *Authenticator {
	provider := Provider{ApiEndpoint: apiEndpoint}
	authenticator := Authenticator{}
	authenticator.provider = &provider
	return &authenticator
}
