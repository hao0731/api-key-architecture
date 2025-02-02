package validator

import (
	"errors"
)

type ValidatorApi interface {
	Authenticate(apiKey string) bool
	GetApiKeyOwner() (string, error)
}

type Validator struct {
	provider   *Provider
	apiKeyInfo *ApiKey
}

func (validator *Validator) Authenticate(apiKey string) (bool, error) {
	result, err := validator.provider.Validate(apiKey)

	if err != nil {
		return false, err
	}

	validator.apiKeyInfo = &result.ApiKeyInfo

	return result.IsValid, nil
}

func (validator Validator) GetApiKeyOwner() (string, error) {
	if validator.apiKeyInfo == nil {
		return "", errors.New("please execute authenticate method first")
	}
	return validator.apiKeyInfo.OwnerId, nil
}

func (validator Validator) GetRoles() ([]string, error) {
	if validator.apiKeyInfo == nil {
		return []string{}, errors.New("please execute authenticate method first")
	}
	return validator.apiKeyInfo.Roles, nil
}

func New(apiEndpoint string) *Validator {
	provider := Provider{ApiEndpoint: apiEndpoint}
	validator := Validator{}
	validator.provider = &provider
	return &validator
}
