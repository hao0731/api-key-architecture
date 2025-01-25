import { Injectable } from '@nestjs/common';
import { defer, map, Observable } from 'rxjs';
import { compare } from 'bcrypt';
import { CreateUser, User, UserLoggedIn } from '@todoapp/user/domain';
import { UserRepository } from './user.repository';
import { UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  createUser(params: CreateUser) {
    return this.userRepository
      .create(params)
      .pipe(map((doc) => this.transformToUser(doc)));
  }

  getUserByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }

  validatePassword(password: string, hash: string): Observable<boolean> {
    return defer(() => compare(password, hash));
  }

  generateLoggedInInformation(user: User): UserLoggedIn {
    const issuer = 'auth-service';
    const issueDate = new Date();
    const expireDate = new Date(new Date().setHours(new Date().getHours() + 1));
    return {
      access_token: {
        iss: issuer,
        sub: user.id,
        jti: crypto.randomUUID(),
        iat: issueDate.valueOf(),
        exp: expireDate.valueOf(),
      },
      refresh_token: {
        iss: issuer,
        sub: user.id,
        jti: crypto.randomUUID(),
        iat: issueDate.valueOf(),
        exp: expireDate.valueOf(),
      },
      exp: expireDate.valueOf(),
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
