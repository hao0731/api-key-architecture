import { Injectable } from '@nestjs/common';
import { hash as bcryptHash } from 'bcrypt';
import { concatMap, defer, iif, map, Observable, throwError } from 'rxjs';
import { CreateUser, Username } from '@todoapp/user/domain';
import { InjectUserModel, UserDocument, UserModel } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectUserModel() private readonly userModel: UserModel) {}

  create(params: CreateUser): Observable<UserDocument> {
    const exist$ = defer(() =>
      this.userModel.exists({ username: params.username }).exec()
    ).pipe(map((query) => !!query));
    return exist$.pipe(
      concatMap((exist) => {
        const hash$ = defer(() => bcryptHash(params.password, 12));
        const alreadyExistsError$ = throwError(
          () => new Error('User already exists')
        );
        return iif(() => exist, alreadyExistsError$, hash$);
      }),
      concatMap((hash) =>
        defer(() =>
          this.userModel.create({
            username: params.username,
            email: params.email,
            password: hash,
          })
        )
      )
    );
  }

  findByUsername(username: Username): Observable<UserDocument | null> {
    return defer(() => this.userModel.findOne({ username }).exec());
  }

  findById(id: string): Observable<UserDocument | null> {
    return defer(() => this.userModel.findById(id).exec());
  }
}
