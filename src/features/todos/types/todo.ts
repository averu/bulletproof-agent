export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TodoCreateInput = Omit<Todo, "id" | "createdAt" | "updatedAt">;
export type TodoUpdateInput = Partial<
  Omit<Todo, "id" | "createdAt" | "updatedAt">
>;
