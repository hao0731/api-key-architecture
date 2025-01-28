import { Body, Controller, Headers, Post } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { CreatedApiKey, ValidateApiKeyResult } from '@todoapp/api-key/domain';
import { UserId } from '@todoapp/user/domain';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto, ValidateApiKeyDto } from './dtos';

@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  createApiKey(
    @Headers('x-user') userId: UserId,
    @Body() dto: CreateApiKeyDto
  ): Observable<CreatedApiKey> {
    return this.apiKeyService
      .createApiKey({ ...dto, ownerId: userId })
      .pipe(
        map(({ apiKey, rawApiKey }) => ({ apiKey: { ...apiKey, rawApiKey } }))
      );
  }

  @Post('validate')
  validateApiKey(
    @Body() dto: ValidateApiKeyDto
  ): Observable<ValidateApiKeyResult> {
    return this.apiKeyService.validateApiKey(dto.apiKey);
  }
}
