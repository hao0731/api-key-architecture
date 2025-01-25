import { Email, Username } from '../types';

export interface CreateUser {
  username: Username;
  email: Email;
  password: string;
}

export interface UserLogin {
  username: Username;
  password: string;
}
