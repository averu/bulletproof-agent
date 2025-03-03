import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { Todo, TodoCreateInput, TodoUpdateInput } from "../types";

// プライマリアトム：Todoリストを保持
export const todosAtom = atom<Todo[]>([]);

// 新しいTodoを追加するアクション
export const addTodoAtom = atom(
  null,
  (get, set, todoInput: TodoCreateInput) => {
    const now = new Date();
    const newTodo: Todo = {
      id: uuidv4(),
      ...todoInput,
      createdAt: now,
      updatedAt: now,
    };
    set(todosAtom, [...get(todosAtom), newTodo]);
    return newTodo;
  }
);

// 特定のTodoを更新するアクション
export const updateTodoAtom = atom(
  null,
  (get, set, { id, ...update }: { id: string } & TodoUpdateInput) => {
    const todos = get(todosAtom);
    const now = new Date();
    set(
      todosAtom,
      todos.map((todo) =>
        todo.id === id ? { ...todo, ...update, updatedAt: now } : todo
      )
    );
  }
);

// Todoを削除するアクション
export const removeTodoAtom = atom(null, (get, set, id: string) => {
  const todos = get(todosAtom);
  set(
    todosAtom,
    todos.filter((todo) => todo.id !== id)
  );
});

// Todoを完了/未完了に切り替えるアクション
export const toggleTodoAtom = atom(null, (get, set, id: string) => {
  const todos = get(todosAtom);
  const now = new Date();
  set(
    todosAtom,
    todos.map((todo) =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: now }
        : todo
    )
  );
});

// 完了済みのTodoを全て削除するアクション
export const clearCompletedTodosAtom = atom(null, (get, set) => {
  const todos = get(todosAtom);
  set(
    todosAtom,
    todos.filter((todo) => !todo.completed)
  );
});

// 全てのTodoを完了/未完了にするアクション
export const toggleAllTodosAtom = atom(null, (get, set, completed: boolean) => {
  const todos = get(todosAtom);
  const now = new Date();
  set(
    todosAtom,
    todos.map((todo) => ({ ...todo, completed, updatedAt: now }))
  );
});

// 派生アトム：未完了のTodo数を算出
export const incompleteTodosCountAtom = atom((get) => {
  const todos = get(todosAtom);
  return todos.filter((todo) => !todo.completed).length;
});

// 派生アトム：完了済みのTodoがあるかどうか
export const hasCompletedTodosAtom = atom((get) => {
  const todos = get(todosAtom);
  return todos.some((todo) => todo.completed);
});
