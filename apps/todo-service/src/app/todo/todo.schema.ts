import {
  InjectModel,
  ModelDefinition,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { MAX_TODO_SUBJECT_LENGTH, TodoSubject } from '@todoapp/todo/domain';
import { HydratedDocument, Model, Types } from 'mongoose';

export type TodoDocument = HydratedDocument<Todo> & {
  updatedAt: Date;
  createdAt: Date;
};

export type TodoModel = Model<TodoDocument>;

@Schema({
  collection: 'todos',
  timestamps: true,
  versionKey: false,
})
export class Todo {
  @Prop({
    required: true,
    type: String,
    maxlength: MAX_TODO_SUBJECT_LENGTH,
  })
  subject: TodoSubject;

  @Prop({
    type: Boolean,
    default: false,
  })
  completed: boolean;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  ownerId: Types.ObjectId;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

export const TodoDefinition: ModelDefinition = {
  name: Todo.name,
  schema: TodoSchema,
};

export const InjectTodoModel = () => InjectModel(TodoDefinition.name);
