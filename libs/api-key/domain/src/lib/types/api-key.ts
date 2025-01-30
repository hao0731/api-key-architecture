import { RoleName } from '@todoapp/permission/domain';
import { UserId } from '@todoapp/user/domain';

export type ApiKeyId = string;
export type ApiKeyHint = string;

export type RawApiKey = `${ApiKeyHint}${string}`;

export type ApiKey = {
  id: ApiKeyId;
  keyHint: ApiKeyHint;
  roles: Array<RoleName>;
  ownerId: UserId;
  expireDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
