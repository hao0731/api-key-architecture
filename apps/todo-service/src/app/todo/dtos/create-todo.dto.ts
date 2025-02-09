import { MAX_TODO_SUBJECT_LENGTH, TodoSubject } from '@todoapp/todo/domain';
import { IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MaxLength(MAX_TODO_SUBJECT_LENGTH)
  subject: TodoSubject;
}
