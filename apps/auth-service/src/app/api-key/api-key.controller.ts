import { Body, Controller, Headers, Post } from '@nestjs/common';
import { UserId } from '@todoapp/user/domain';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dtos';
import { map, Observable } from 'rxjs';
import { CreatedApiKey } from '@todoapp/api-key/domain';

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
}
