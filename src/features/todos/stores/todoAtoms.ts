import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { v4 as uuidv4 } from "uuid";
import { Todo, TodoCreateInput, TodoUpdateInput } from "../types";

// ソートの状態を保持する atom
export const sortTypeAtom = atomWithStorage<{
  sortType: "createdAt" | "title" | null;
  sortOrder: "asc" | "desc" | "none";
}>("sortType", {
  sortType: null,
  sortOrder: "none",
});

// プライマリアトム：Todo リストを保持
export const todosAtom = atomWithStorage<Todo[] | undefined>(
  "todos",
  undefined,
);

// 派生アトム：ソートされた Todo リスト
export const sortedTodosAtom = atom((get) => {
  const todos = get(todosAtom);
  const sortType = get(sortTypeAtom);

  if (!todos) return [];

  if (!sortType.sortType || sortType.sortOrder === "none") {
    return todos;
  }

  return [...todos].sort((a, b) => {
    const order = sortType.sortOrder === "asc" ? 1 : -1;
    if (sortType.sortType === "createdAt") {
      return (
        order *
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      );
    } else if (sortType.sortType === "title") {
      return order * a.title.localeCompare(b.title);
    }
    return 0;
  });
});

// 選択されたTodoのID
export const selectedTodoIdAtom = atom<string | null>(null);

// 詳細画面の表示状態
export const showTodoDetailAtom = atom(false);

// 編集画面の表示状態
export const showTodoEditAtom = atom(false);

// 新しいTodoを追加するアクション
export const addTodoAtom = atom(
  null,
  (get, set, todoInput: TodoCreateInput) => {
    const todos = get(todosAtom);
    if (!todos) return; // todos が undefined の場合は何もしない

    const now = new Date();
    const newTodo: Todo = {
      id: uuidv4(),
      ...todoInput,
      createdAt: now,
      updatedAt: now,
    };
    set(todosAtom, [...todos, newTodo]);
    return newTodo;
  },
);

// 特定のTodoを更新するアクション
export const updateTodoAtom = atom(
  null,
  (get, set, { id, ...update }: { id: string } & TodoUpdateInput) => {
    const todos = get(todosAtom);
    if (!todos) return; // todos が undefined の場合は何もしない

    const now = new Date();
    set(
      todosAtom,
      todos.map((todo) =>
        todo.id === id ? { ...todo, ...update, updatedAt: now } : todo
      ),
    );
  },
);

// Todoを削除するアクション
export const removeTodoAtom = atom(null, (get, set, id: string) => {
  const todos = get(todosAtom);
  if (!todos) return; // todos が undefined の場合は何もしない

  set(
    todosAtom,
    todos.filter((todo) => todo.id !== id),
  );
});

// Todoを完了/未完了に切り替えるアクション
export const toggleTodoAtom = atom(null, (get, set, id: string) => {
  const todos = get(todosAtom);
  if (!todos) return; // todos が undefined の場合は何もしない

  const now = new Date();
  set(
    todosAtom,
    todos.map((todo) =>
      todo.id === id
        ? { ...todo, deleted: !todo.deleted, updatedAt: now }
        : todo
    ),
  );
});

// 完了済みのTodoを全て削除するアクション
export const clearCompletedTodosAtom = atom(null, (get, set) => {
  const todos = get(todosAtom);
  if (!todos) return; // todos が undefined の場合は何もしない

  set(
    todosAtom,
    todos.filter((todo) => !todo.deleted),
  );
});

// 全てのTodoを完了/未完了にするアクション
export const toggleAllTodosAtom = atom(null, (get, set, deleted: boolean) => {
  const todos = get(todosAtom);
  if (!todos) return; // todos が undefined の場合は何もしない

  const now = new Date();
  set(
    todosAtom,
    todos.map((todo) => ({ ...todo, deleted, updatedAt: now })),
  );
});

// 派生アトム：未完了のTodo数を算出
export const incompleteTodosCountAtom = atom((get) => {
  const todos = get(todosAtom);
  return todos ? todos.filter((todo) => !todo.deleted).length : 0;
});

// 派生アトム：完了済みのTodoがあるかどうか
export const hasCompletedTodosAtom = atom((get) => {
  const todos = get(todosAtom);
  return todos ? todos.some((todo) => todo.deleted) : false;
});
