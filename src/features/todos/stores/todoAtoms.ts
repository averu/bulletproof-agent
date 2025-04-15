import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { v4 as uuidv4 } from "uuid";
import { Status, Todo, TodoCreateInput, TodoUpdateInput } from "../types"; // Status をインポート

// ソートの状態を保持する atom
export const sortTypeAtom = atomWithStorage<{
  sortType: "createdAt" | "title" | null;
  sortOrder: "asc" | "desc" | "none";
}>("sortType", {
  sortType: null,
  sortOrder: "none",
});

// フィルタリングの状態を保持する atom ('all', 'active', 'completed')
export const filterTypeAtom = atomWithStorage<Status[]>( // 型を Status[] に変更 (複数選択)
  "filterType",
  [], // 初期値は空配列 (すべて表示 -> 変更: 何も選択されていない状態)
);

// 検索キーワードを保持する atom
export const searchTermAtom = atom("");

// 担当者フィルターの状態を保持する atom (空文字列はすべて表示)
export const filterAssigneeIdAtom = atomWithStorage<string>(
  "filterAssigneeId",
  "",
);

// 期日フィルターの状態を保持する atom (null は未指定)
export const filterStartDateAtom = atomWithStorage<string | null>(
  "filterStartDate",
  null,
);
export const filterEndDateAtom = atomWithStorage<string | null>(
  "filterEndDate",
  null,
);

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

// 派生アトム：フィルタリングされた Todo リスト (ステータス)
export const filteredTodosAtom = atom((get) => {
  const todos = get(sortedTodosAtom); // ソート済みのリストを使用
  const selectedStatuses = get(filterTypeAtom); // 型は Status[]

  // 選択されたステータスがない場合 (空配列) は、空のリストを返す
  if (selectedStatuses.length === 0) {
    return []; // 変更: todos -> []
  }

  // 選択されたステータスのいずれかに一致する Todo をフィルタリング
  return todos.filter((todo) => selectedStatuses.includes(todo.status));
});

// 派生アトム：検索および他のフィルターを適用した最終的な Todo リスト
export const searchedTodosAtom = atom((get) => {
  let todos = get(filteredTodosAtom); // ステータスフィルタリング済みのリストを使用
  const searchTerm = get(searchTermAtom).toLowerCase();
  const filterAssigneeId = get(filterAssigneeIdAtom);
  const filterStartDateStr = get(filterStartDateAtom); // 開始日を取得 (文字列 or null)
  const filterEndDateStr = get(filterEndDateAtom); // 終了日を取得 (文字列 or null)

  // 担当者IDで絞り込み (filterAssigneeId が空文字列でない場合)
  if (filterAssigneeId) {
    // assigneeId が null や undefined の場合も考慮
    todos = todos.filter((todo) =>
      todo.assigneeId && todo.assigneeId === filterAssigneeId
    );
  }

  // 期日で絞り込み
  const startDate = filterStartDateStr
    ? new Date(filterStartDateStr + "T00:00:00")
    : null; // Dateオブジェクトに変換 (時刻を00:00:00に)
  const endDate = filterEndDateStr
    ? new Date(filterEndDateStr + "T23:59:59")
    : null; // Dateオブジェクトに変換 (時刻を23:59:59に)

  if (startDate || endDate) {
    todos = todos.filter((todo) => {
      if (!todo.dueDate) return false; // 期日がないものは除外

      // todo.dueDate が Date オブジェクトであることを確認 (もし文字列なら変換)
      const todoDueDate = todo.dueDate instanceof Date
        ? todo.dueDate
        : new Date(todo.dueDate);

      // 開始日チェック (startDate があり、かつ todoDueDate が startDate より前なら false)
      if (startDate && todoDueDate < startDate) {
        return false;
      }
      // 終了日チェック (endDate があり、かつ todoDueDate が endDate より後なら false)
      if (endDate && todoDueDate > endDate) {
        return false;
      }
      return true; // 上記チェックをパスしたら true
    });
  }

  // 検索キーワードで絞り込み (searchTerm が空文字列でない場合)
  if (searchTerm) {
    todos = todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchTerm) ||
        (todo.description &&
          todo.description.toLowerCase().includes(searchTerm)),
    );
  }

  return todos; // 最終的なリストを返す
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
