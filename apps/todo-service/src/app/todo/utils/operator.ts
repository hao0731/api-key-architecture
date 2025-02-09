import { whenResourceExist } from '@todoapp/infra';
import { Todo, TodoId } from '@todoapp/todo/domain';

export const whenTodoExist = <R>(
  todoId: TodoId,
  returnFn: (todo: Todo) => R
) => {
  return whenResourceExist<Todo, R>({
    errorMessageFn: () =>
      `The Todo with id ${todoId} does not exist. Please verify whether the id is correct.`,
    returnFn,
  });
};
