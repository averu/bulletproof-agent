import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { TodoList } from "./TodoList";
import { useAtom, useAtomValue } from "jotai";
import { describe, it, expect, vi, Mock } from "vitest";

// Mock the Jotai atom
vi.mock("jotai", () => {
  return {
    useAtom: vi.fn(),
    useAtomValue: vi.fn(),
    atom: vi.fn(),
  };
});

describe("TodoList", () => {
  it("renders without todos", () => {
    (useAtom as Mock).mockReturnValue([[], vi.fn()]);
    (useAtomValue as Mock).mockReturnValue({ user: null });
    render(<TodoList />);
    expect(
      screen.getByText("Please sign in to view your todos.")
    ).toBeVisible();
  });
});
