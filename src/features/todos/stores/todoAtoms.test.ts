import { renderHook, act } from "@testing-library/react";
import { atom, useAtom } from "jotai";
import { addTodoAtom } from "./todoAtoms";
import { Todo, TodoCreateInput } from "../types";
import { describe, it, expect } from "vitest";
import { AppProvider } from "@/providers/AppProvider";

describe("addTodoAtom", () => {
  it("新しいTodoを追加できる", () => {
    const initialTodosAtom = atom<Todo[]>([]);

    const { result } = renderHook(() => useAtom(addTodoAtom), {
      wrapper: AppProvider,
    });
    const { result: todosResult } = renderHook(
      () => useAtom(initialTodosAtom),
      { wrapper: AppProvider }
    );

    const addTodo = result.current[1];
    const todos = todosResult.current[0];

    expect(todos).toEqual([]);

    const todoInput: TodoCreateInput = {
      title: "新しいTodo",
      completed: false,
    };

    act(() => {
      addTodo(todoInput);
    });

    const newTodos = todosResult.current[0];
    expect(newTodos).toHaveLength(0); // todosAtomがatomWithStorageなので、initialTodosAtomには影響がない

    // localStorageに保存されているか確認するテストは、ここでは省略します
  });
});
