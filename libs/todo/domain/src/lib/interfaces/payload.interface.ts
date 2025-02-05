import { UserId } from '@todoapp/user/domain';
import { TodoId, TodoSubject } from '../types';

export interface CreateTodo {
  subject: TodoSubject;
  ownerId: UserId;
}

export interface UpdateTodo {
  id: TodoId;
  subject?: TodoSubject;
  completed?: boolean;
}

export interface RemoveTodo {
  id: TodoId;
}
