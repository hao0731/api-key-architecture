import { MAX_TODO_SUBJECT_LENGTH, TodoSubject } from '@todoapp/todo/domain';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @MaxLength(MAX_TODO_SUBJECT_LENGTH)
  subject?: TodoSubject;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
