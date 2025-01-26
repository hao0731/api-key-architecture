import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { concatMap, iif, map, Observable, of, throwError } from 'rxjs';
import { CreatedUser } from '@todoapp/user/domain';
import { UserService } from './user.service';
import { CreateUserDto, UserLoginDto } from './dtos';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto): Observable<CreatedUser> {
    return this.userService.createUser(dto).pipe(map((user) => ({ user })));
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id).pipe(
      concatMap((doc) => {
        if (!doc) {
          return throwError(() => new NotFoundException('User not found'));
        }
        return of(this.userService.transformToUser(doc));
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
