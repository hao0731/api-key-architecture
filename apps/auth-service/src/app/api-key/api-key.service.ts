import { Injectable } from '@nestjs/common';
import { concatMap, defer, map, of } from 'rxjs';
import { compare as bcryptCompare } from 'bcrypt';
import {
  ApiKey,
  captureKeyHint,
  CreateApiKey,
  RawApiKey,
} from '@todoapp/api-key/domain';
import { ApiKeyRepository } from './api-key.repository';
import { ApiKeyDocument } from './api-key.schema';

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

  validateApiKey(apiKey: RawApiKey) {
    const keyHint = captureKeyHint(apiKey);
    return this.apiKeyRepository.findByKeyHint(keyHint).pipe(
      concatMap((document) => {
        if (!document) {
          return of(false);
        }

        if (
          (document.expireDate?.getTime() ?? Infinity) < new Date().getTime()
        ) {
          return of(false);
        }

        return defer(() => bcryptCompare(apiKey, document.key));
      })
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
