import { Injectable } from '@nestjs/common';
import { concatMap, defer, map, Observable, of } from 'rxjs';
import { compare as bcryptCompare } from 'bcrypt';
import {
  ApiKey,
  captureKeyHint,
  CreateApiKey,
  RawApiKey,
  ValidateApiKeyResult,
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

  validateApiKey(apiKey: RawApiKey): Observable<ValidateApiKeyResult> {
    const keyHint = captureKeyHint(apiKey);
    return this.apiKeyRepository.findByKeyHint(keyHint).pipe(
      concatMap((document) => {
        if (!document) {
          return of({ isValid: false, apiKey: null });
        }

        if (
          (document.expireDate?.getTime() ?? Infinity) < new Date().getTime()
        ) {
          return of({ isValid: false, apiKey: null });
        }

        return defer(() => bcryptCompare(apiKey, document.key)).pipe(
          map((isValid) => ({
            isValid,
            apiKey: this.transformToApiKey(document),
          }))
        );
      })
    );
  }

  transformToApiKey(document: ApiKeyDocument): ApiKey {
    return {
      id: document._id.toString(),
      keyHint: document.keyHint,
      roles: document.roles,
      ownerId: document.ownerId.toString(),
      expireDate: document.expireDate,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
