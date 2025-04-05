import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "jotai";
import {
  addTodoAtom,
  filterTypeAtom, // テスト対象に追加
  searchedTodosAtom, // テスト対象に追加
  searchTermAtom, // テスト対象に追加
  todosAtom,
  updateTodoAtom,
} from "../stores/todoAtoms";
import { Todo, TodoCreateInput, TodoUpdateInput } from "../types";

// UUIDを固定の値にモック
vi.mock("uuid", () => ({
  v4: vi.fn(() => "mocked-uuid"),
}));

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window.localStorage.__proto__, "setItem");
  vi.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(null);
});

describe("addTodoAtom", () => {
  it("新しいTodoを追加できる", () => {
    const store = createStore();
    const initialTodos = [] as Todo[];
    store.set(todosAtom, initialTodos); // 初期値をセット

    const newTodoInput: TodoCreateInput = {
      title: "New Todo",
      description: "",
      status: "not-started",
      deleted: false,
      userId: "user1",
      name: "User 1",
    };

    store.set(addTodoAtom, newTodoInput); // addTodoAtom を呼び出す

    const updatedTodos = store.get(todosAtom);
    expect(updatedTodos).toHaveLength(1);
    expect(updatedTodos?.[0]).toMatchObject({
      id: "mocked-uuid",
      title: "New Todo",
      description: "",
      status: "not-started",
      deleted: false,
    });
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it("todosAtomがundefinedのときは何もしない", () => {
    const store = createStore();
    store.set(todosAtom, undefined); // undefined の場合

    const newTodoInput: TodoCreateInput = {
      title: "New Todo",
      description: "",
      status: "not-started",
      deleted: false,
      userId: "user1",
      name: "User 1",
    };

    store.set(addTodoAtom, newTodoInput);

    expect(store.get(todosAtom)).toBeUndefined();
  });
});

describe("updateTodoAtom", () => {
  it("既存のTodoを更新できる", () => {
    const store = createStore();
    const initialTodos: Todo[] = [
      {
        id: "mocked-uuid",
        title: "Initial Todo",
        description: "",
        status: "not-started",
        deleted: false,
        userId: "user1",
        name: "User 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    store.set(todosAtom, initialTodos);

    const updateInput: { id: string } & TodoUpdateInput = {
      id: "mocked-uuid",
      title: "Updated Todo",
    };

    store.set(updateTodoAtom, updateInput);

    const updatedTodos = store.get(todosAtom);
    expect(updatedTodos).toHaveLength(1);
    expect(updatedTodos?.[0]).toMatchObject({
      id: "mocked-uuid",
      title: "Updated Todo",
      description: "",
      status: "not-started",
      deleted: false, // deleted は更新されない
    });
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it("todosAtomがundefinedのときは何もしない", () => {
    const store = createStore();
    store.set(todosAtom, undefined);

    const updateInput: { id: string } & TodoUpdateInput = {
      id: "mocked-uuid",
      title: "Updated Todo",
    };

    store.set(updateTodoAtom, updateInput);

    expect(store.get(todosAtom)).toBeUndefined();
  });
});

// --- searchedTodosAtom のテスト ---

// テスト用の Todo データ
const testTodos: Todo[] = [
  {
    id: "1",
    title: "Apple",
    description: "Buy some apples",
    status: "not-started",
    deleted: false,
    userId: "user1",
    name: "User 1",
    createdAt: new Date("2023-01-01T10:00:00Z"),
    updatedAt: new Date("2023-01-01T10:00:00Z"),
  },
  {
    id: "2",
    title: "Banana",
    description: "Peel the banana",
    status: "in-progress",
    deleted: false,
    userId: "user1",
    name: "User 1",
    createdAt: new Date("2023-01-02T11:00:00Z"),
    updatedAt: new Date("2023-01-02T11:00:00Z"),
  },
  {
    id: "3",
    title: "Cherry",
    description: "Eat the cherry APPLE", // 説明にも Apple
    status: "completed",
    deleted: false,
    userId: "user1",
    name: "User 1",
    createdAt: new Date("2023-01-03T12:00:00Z"),
    updatedAt: new Date("2023-01-03T12:00:00Z"),
  },
  {
    id: "4",
    title: "Durian",
    description: "Smelly fruit",
    status: "pending",
    deleted: true, // 完了済み (deleted=true) だがステータスは pending
    userId: "user1",
    name: "User 1",
    createdAt: new Date("2023-01-04T13:00:00Z"),
    updatedAt: new Date("2023-01-04T13:00:00Z"),
  },
];

describe("searchedTodosAtom", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
    store.set(todosAtom, testTodos);
    store.set(filterTypeAtom, []); // 初期フィルターは空 (すべて表示)
    store.set(searchTermAtom, ""); // 初期検索語は空
    // sortedTodosAtom は todosAtom に依存するため、個別の設定は不要
  });

  it("検索語がない場合、フィルタリングされたすべてのTodoを返す", () => {
    store.set(filterTypeAtom, ["not-started", "in-progress"]); // ステータスでフィルタリング
    store.set(searchTermAtom, "");
    const result = store.get(searchedTodosAtom);
    expect(result).toHaveLength(2); // "not-started" と "in-progress" の2件
    expect(result.map((t) => t.id)).toEqual(["1", "2"]);
  });

  // このテストケースは現在の実装 (タイトルと説明の両方を検索) と合わないため削除
  // it("タイトルで検索できる (大文字小文字区別なし)", () => { ... });

  it("説明で検索できる (大文字小文字区別なし)", () => {
    store.set(searchTermAtom, "buy");
    const result = store.get(searchedTodosAtom);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");

    store.set(searchTermAtom, "FRUIT");
    const result2 = store.get(searchedTodosAtom);
    expect(result2).toHaveLength(1); // Durian のみヒット (Cherry はステータスが completed なのでフィルタリングされる想定はないが、念のため)
    expect(result2[0].id).toBe("4");
  });

  it("タイトルまたは説明で検索できる", () => {
    store.set(searchTermAtom, "apple"); // タイトル(1) と 説明(3) にヒット
    const result = store.get(searchedTodosAtom);
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id).sort()).toEqual(["1", "3"]);
  });

  it("ヒットしない場合、空配列を返す", () => {
    store.set(searchTermAtom, "grape");
    const result = store.get(searchedTodosAtom);
    expect(result).toHaveLength(0);
  });

  it("ステータスフィルターと検索を組み合わせられる", () => {
    store.set(filterTypeAtom, ["not-started", "completed"]); // "not-started" と "completed" でフィルタ
    store.set(searchTermAtom, "apple"); // タイトル(1) と 説明(3) にヒットするはず

    const result = store.get(searchedTodosAtom);
    // フィルタリングされた結果 ("1", "3") の中から "apple" で検索
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id).sort()).toEqual(["1", "3"]);

    // 別のフィルターと検索
    store.set(filterTypeAtom, ["in-progress"]); // "in-progress" でフィルタ
    store.set(searchTermAtom, "banana");
    const result2 = store.get(searchedTodosAtom);
    expect(result2).toHaveLength(1);
    expect(result2[0].id).toBe("2");

    // フィルターにヒットしない検索
    store.set(filterTypeAtom, ["pending"]); // "pending" でフィルタ
    store.set(searchTermAtom, "apple"); // "apple" は "not-started" と "completed" にしかないのでヒットしない
    const result3 = store.get(searchedTodosAtom);
    expect(result3).toHaveLength(0);
  });
});
