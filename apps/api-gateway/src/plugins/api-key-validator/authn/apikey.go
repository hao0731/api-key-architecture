package authn

type ApiKey struct {
	Roles   []string `json: roles`
	OwnerId string   `json:"ownerId"`
}

type ValidateApiKeyResult struct {
	IsValid    bool   `json:"isValid"`
	ApiKeyInfo ApiKey `json:"apiKey"`
}
