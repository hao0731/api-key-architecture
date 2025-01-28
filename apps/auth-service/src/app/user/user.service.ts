import { Inject, Injectable } from '@nestjs/common';
import { defer, map, Observable } from 'rxjs';
import { compare } from 'bcrypt';
import { CreateUser, User, UserLoggedIn } from '@todoapp/user/domain';
import { UserRepository } from './user.repository';
import { UserDocument } from './user.schema';
import { TokenConfig, tokenConfig } from '../config';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(tokenConfig.KEY) private readonly tokenConfig: TokenConfig
  ) {}

  createUser(params: CreateUser) {
    return this.userRepository
      .create(params)
      .pipe(map((doc) => this.transformToUser(doc)));
  }

  getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  getUserByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }

  validatePassword(password: string, hash: string): Observable<boolean> {
    return defer(() => compare(password, hash));
  }

  generateLoggedInInformation(user: User): UserLoggedIn {
    const expireDate = new Date(new Date().setHours(new Date().getHours() + 1));
    const expiration = Math.floor(expireDate.getTime() / 1000);
    return {
      access_token: {
        iss: this.tokenConfig.issuer,
        aud: this.tokenConfig.audience,
        sub: user.id,
        jti: crypto.randomUUID(),
        exp: expiration,
      },
      refresh_token: {
        iss: this.tokenConfig.issuer,
        aud: this.tokenConfig.audience,
        sub: user.id,
        jti: crypto.randomUUID(),
        exp: expiration,
      },
      exp: expiration,
    };
  }

  transformToUser(doc: UserDocument): User {
    const obj = doc.toObject();
    return {
      id: obj._id.toString(),
      username: obj.username,
      email: obj.email,
    };
  }
}
