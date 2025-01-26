import {
  IsRoleName,
  MAX_ROLE_NAME_LENGTH,
  RoleName,
} from '@todoapp/permission/domain';
import { IsArray, IsDateString, IsOptional, MaxLength } from 'class-validator';

export class CreateApiKeyDto {
  @IsArray()
  @IsRoleName({ each: true })
  @MaxLength(MAX_ROLE_NAME_LENGTH, { each: true })
  roles: Array<RoleName>;

  @IsDateString()
  @IsOptional()
  expireDate: Date | null;
}
