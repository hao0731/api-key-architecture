import { RawApiKey, ValidateApiKey } from '@todoapp/api-key/domain';
import { IsString, IsUUID } from 'class-validator';

export class ValidateApiKeyDto implements ValidateApiKey {
  @IsString()
  @IsUUID(4)
  apiKey: RawApiKey;
}
