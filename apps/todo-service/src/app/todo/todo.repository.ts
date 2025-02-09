import { Injectable } from '@nestjs/common';
import {
  CreateTodo,
  GetTodo,
  RemoveTodo,
  UpdateTodo,
} from '@todoapp/todo/domain';
import { InjectTodoModel, TodoDocument, TodoModel } from './todo.schema';
import { defer, Observable } from 'rxjs';

@Injectable()
export class TodoRepository {
  constructor(@InjectTodoModel() private readonly todoModel: TodoModel) {}

  create(params: CreateTodo): Observable<TodoDocument> {
    return defer(() =>
      this.todoModel.create({
        subject: params.subject,
        ownerId: params.ownerId,
      })
    );
  }

  find(data: GetTodo): Observable<TodoDocument | null> {
    return defer(() =>
      this.todoModel.findOne({ _id: data.id, ownerId: data.ownerId }).exec()
    );
  }

  remove(data: RemoveTodo): Observable<TodoDocument | null> {
    return defer(() =>
      this.todoModel
        .findOneAndDelete({ _id: data.id, ownerId: data.ownerId })
        .exec()
    );
  }

  update(data: UpdateTodo): Observable<TodoDocument | null> {
    const { id, ownerId, ...params } = data;
    return defer(() =>
      this.todoModel
        .findOneAndUpdate({ _id: id, ownerId }, params, { new: true })
        .exec()
    );
  }
}
