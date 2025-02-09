export type TodoId = string;
export type TodoSubject = string;

export type Todo = {
  id: TodoId;
  subject: TodoSubject;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};
