import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { concatMap, iif, map, Observable, of, throwError } from 'rxjs';
import { CreatedUser, GotUser } from '@todoapp/user/domain';
import { UserService } from './user.service';
import { CreateUserDto, UserLoginDto } from './dtos';
import { AuthGuard, User, whenResourceExist } from '@todoapp/infra';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto): Observable<CreatedUser> {
    return this.userService.createUser(dto).pipe(map((user) => ({ user })));
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(
    @User() userId: string,
    @Param('id') id: string
  ): Observable<GotUser> {
    if (userId !== id) {
      throw new ForbiddenException('You only can get your user information.');
    }
    return this.userService.getUserById(id).pipe(
      whenResourceExist({
        errorMessageFn: () =>
          `The User with id ${id} does not exist. Please verify whether the id is correct.`,
        returnFn: (doc) => ({ user: this.userService.transformToUser(doc) }),
      })
    );
  }

  @Post('login')
  login(@Body() dto: UserLoginDto) {
    const throwUnauthorizedError = () => {
      return throwError(
        () => new UnauthorizedException('Invalid username or password')
      );
    };

    return this.userService.getUserByUsername(dto.username).pipe(
      concatMap((user) => {
        if (!user) {
          return throwUnauthorizedError();
        }
        return this.userService
          .validatePassword(dto.password, user.password)
          .pipe(
            concatMap((isValid) => {
              return iif(
                () => isValid,
                of(
                  this.userService.generateLoggedInInformation(
                    this.userService.transformToUser(user)
                  )
                ),
                throwUnauthorizedError()
              );
            })
          );
      })
    );
  }
}
