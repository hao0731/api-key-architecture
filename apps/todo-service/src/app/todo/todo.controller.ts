import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, User } from '@todoapp/infra';
import { UserId } from '@todoapp/user/domain';
import {
  CreatedTodo,
  GotTodo,
  TodoId,
  UpdatedTodo,
} from '@todoapp/todo/domain';
import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto } from './dtos';
import { whenTodoExist } from './utils';
import { map, Observable } from 'rxjs';

@UseGuards(AuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  createTodo(
    @Body() dto: CreateTodoDto,
    @User() userId: UserId
  ): Observable<CreatedTodo> {
    return this.todoService
      .createTodo({
        subject: dto.subject,
        ownerId: userId,
      })
      .pipe(map((todo) => ({ todo })));
  }

  @Get(':id')
  getTodo(
    @Param('id') todoId: TodoId,
    @User() userId: UserId
  ): Observable<GotTodo> {
    return this.todoService
      .getTodo({ id: todoId, ownerId: userId })
      .pipe(whenTodoExist(todoId, (todo) => ({ todo })));
  }

  @Patch(':id')
  updateTodo(
    @Param('id') todoId: TodoId,
    @Body() dto: UpdateTodoDto,
    @User() userId: UserId
  ): Observable<UpdatedTodo> {
    return this.todoService
      .updateTodo({
        id: todoId,
        ownerId: userId,
        ...dto,
      })
      .pipe(whenTodoExist(todoId, (todo) => ({ todo })));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  removeTodo(@Param('id') todoId: TodoId, @User() userId: UserId) {
    return this.todoService
      .removeTodo({ id: todoId, ownerId: userId })
      .pipe(whenTodoExist(todoId, () => null));
  }
}
