import { describe, it, expect, beforeEach, vi } from "vitest";
import { createStore } from "jotai";
import { todosAtom, addTodoAtom, updateTodoAtom } from "../stores/todoAtoms";
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
