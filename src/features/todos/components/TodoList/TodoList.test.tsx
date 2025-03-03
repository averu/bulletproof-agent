import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { TodoList } from "./TodoList";
import { useAtom } from "jotai";
import { describe, it, expect, vi, Mock } from "vitest";

// Mock the Jotai atom
vi.mock("jotai", () => {
  return {
    useAtom: vi.fn(),
    atom: vi.fn(),
  };
});

describe("TodoList", () => {
  it("renders without todos", () => {
    (useAtom as Mock).mockReturnValue([[], vi.fn()]);
    render(<TodoList />);
    expect(
      screen.getByText("タスクがありません。新しいタスクを追加してください。")
    ).toBeVisible();
  });
});
