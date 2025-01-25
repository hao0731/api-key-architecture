import { IsEmail, MaxLength, MinLength } from 'class-validator';
import {
  CreateUser,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from '@todoapp/user/domain';

export class CreateUserDto implements CreateUser {
  @MinLength(MIN_USERNAME_LENGTH)
  @MaxLength(MAX_USERNAME_LENGTH)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  password: string;
}
