export type TodoId = string;

export type Todo = {
  id: TodoId;
  subject: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};
