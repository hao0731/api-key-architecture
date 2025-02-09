import { TodoDocument } from '../todo.schema';

export const transformToTodo = (doc: TodoDocument) => ({
  id: doc._id.toString(),
  subject: doc.subject,
  completed: doc.completed,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const transformToTodoOrNull = (doc: TodoDocument | null) => {
  if (!doc) {
    return null;
  }
  return transformToTodo(doc);
};
