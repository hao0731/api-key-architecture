import { Injectable } from '@nestjs/common';
import { Observable, concatMap, defer, iif, map, throwError } from 'rxjs';
import { hash as bcryptHash } from 'bcrypt';
import {
  API_KEY_COUNT_LIMIT,
  captureKeyHint,
  CreateApiKey,
  RawApiKey,
} from '@todoapp/api-key/domain';
import {
  ApiKeyDocument,
  ApiKeyModel,
  InjectApiKeyModel,
} from './api-key.schema';

@Injectable()
export class ApiKeyRepository {
  constructor(@InjectApiKeyModel() private readonly apiKeyModel: ApiKeyModel) {}

  create(
    params: CreateApiKey
  ): Observable<{ rawApiKey: RawApiKey; document: ApiKeyDocument }> {
    const isExceedLimitCount = (docs: Array<ApiKeyDocument>) =>
      docs.length >= API_KEY_COUNT_LIMIT;

    const generateApiKey = () => {
      const apiKey = crypto.randomUUID();
      const keyHint = captureKeyHint(apiKey);
      const key$ = defer(() => bcryptHash(apiKey, 12));
      return key$.pipe(
        concatMap((key) => {
          return defer(() => {
            return this.apiKeyModel.create({
              key,
              keyHint,
              roles: params.roles,
              ownerId: params.ownerId,
              expireDate: params.expireDate,
            });
          }).pipe(map((doc) => ({ rawApiKey: apiKey, document: doc })));
        })
      );
    };

    const apiKeys$ = defer(() =>
      this.apiKeyModel
        .find({ ownerId: params.ownerId })
        .limit(API_KEY_COUNT_LIMIT + 1)
        .exec()
    );

    return apiKeys$.pipe(
      concatMap((docs) =>
        iif(
          () => isExceedLimitCount(docs),
          throwError(() => new Error('Exceed limit count')),
          generateApiKey()
        )
      )
    );
  }
}
