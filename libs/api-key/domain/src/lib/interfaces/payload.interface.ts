import { RoleName } from '@todoapp/permission/domain';
import { UserId } from '@todoapp/user/domain';
import { RawApiKey } from '../types';

export interface CreateApiKey {
  ownerId: UserId;
  roles: Array<RoleName>;
  expireDate: Date | null;
}

export interface ValidateApiKey {
  apiKey: RawApiKey;
}
