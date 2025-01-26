import { RoleName } from '@todoapp/permission/domain';

export type ApiKeyId = string;
export type ApiKeyHint = string;

export type ApiKey = {
  id: ApiKeyId;
  keyHint: ApiKeyHint;
  roles: Array<RoleName>;
  expireDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
