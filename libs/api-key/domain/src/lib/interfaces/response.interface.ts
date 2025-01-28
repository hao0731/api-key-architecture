import { ApiKey, RawApiKey } from '../types';

export interface CreatedApiKey {
  apiKey: ApiKey & { rawApiKey: RawApiKey };
}

export interface ValidateApiKeyResult {
  isValid: boolean;
}
