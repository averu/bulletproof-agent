import React from "react";
import { TodoForm, TodoList, TodoStats } from "../components";

export const Todos: React.FC = () => {
  return (
    <div className="mx-auto p-4 w-full max-w-md">
      <h1 className="text-xl font-bold text-center mb-4">ToDoリスト</h1>
      <TodoForm />
      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <TodoList />
        <TodoStats />
      </div>
    </div>
  );
};
