package validator

type ApiKey struct {
	// Roles      []string `json: Roles`
	OwnerId string `json:"ownerId"`
}

type ValidateApiKeyResult struct {
	IsValid    bool   `json:"isValid"`
	ApiKeyInfo ApiKey `json:"apiKey"`
}
