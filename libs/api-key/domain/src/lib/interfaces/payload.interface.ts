import { RoleName } from '@todoapp/permission/domain';
import { UserId } from '@todoapp/user/domain';

export interface CreateApiKey {
  ownerId: UserId;
  roles: Array<RoleName>;
  expireDate: Date | null;
}
