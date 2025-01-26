import { Injectable } from '@nestjs/common';
import { ApiKey, CreateApiKey } from '@todoapp/api-key/domain';
import { ApiKeyRepository } from './api-key.repository';
import { ApiKeyDocument } from './api-key.schema';
import { map } from 'rxjs';

@Injectable()
export class ApiKeyService {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  createApiKey(params: CreateApiKey) {
    return this.apiKeyRepository.create(params).pipe(
      map(({ rawApiKey, document }) => ({
        rawApiKey,
        apiKey: this.transformToApiKey(document),
      }))
    );
  }

  transformToApiKey(document: ApiKeyDocument): ApiKey {
    return {
      id: document._id.toString(),
      keyHint: document.keyHint,
      roles: document.roles,
      expireDate: document.expireDate,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
