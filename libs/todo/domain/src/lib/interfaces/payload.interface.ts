import { UserId } from '@todoapp/user/domain';
import { TodoId, TodoSubject } from '../types';

export interface CreateTodo {
  subject: TodoSubject;
  ownerId: UserId;
}

export interface UpdateTodo {
  id: TodoId;
  ownerId: UserId;
  subject?: TodoSubject;
  completed?: boolean;
}

export interface RemoveTodo {
  id: TodoId;
  ownerId: UserId;
}

export interface GetTodo {
  id: TodoId;
  ownerId: UserId;
}
