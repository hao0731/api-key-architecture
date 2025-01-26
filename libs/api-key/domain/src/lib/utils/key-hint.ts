import { API_KEY_HINT_LENGTH } from '../constants';
import { ApiKeyHint } from '../types';

export const captureKeyHint = (apiKey: string): ApiKeyHint =>
  apiKey.slice(0, API_KEY_HINT_LENGTH);
