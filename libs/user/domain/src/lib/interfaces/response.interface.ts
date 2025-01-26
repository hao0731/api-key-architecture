import { User } from '../types';

export interface CreatedUser {
  user: User;
}

export interface UserLoggedIn {
  access_token: JWTContent;
  refresh_token: JWTContent;
  exp: number;
}

export type JWTContent = {
  aud: string;
  iss: string;
  sub: string;
  jti: string;
  exp: number;
};
