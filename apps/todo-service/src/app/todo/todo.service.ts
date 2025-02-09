import { Injectable } from '@nestjs/common';
import {
  CreateTodo,
  GetTodo,
  RemoveTodo,
  UpdateTodo,
} from '@todoapp/todo/domain';
import { map } from 'rxjs';
import { TodoRepository } from './todo.repository';
import { transformToTodo, transformToTodoOrNull } from './utils';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  createTodo(params: CreateTodo) {
    return this.todoRepository
      .create(params)
      .pipe(map((doc) => transformToTodo(doc)));
  }

  getTodo(params: GetTodo) {
    return this.todoRepository
      .find(params)
      .pipe(map((doc) => transformToTodoOrNull(doc)));
  }

  updateTodo(params: UpdateTodo) {
    return this.todoRepository
      .update(params)
      .pipe(map((doc) => transformToTodoOrNull(doc)));
  }

  removeTodo(params: RemoveTodo) {
    return this.todoRepository
      .remove(params)
      .pipe(map((doc) => transformToTodoOrNull(doc)));
  }
}
