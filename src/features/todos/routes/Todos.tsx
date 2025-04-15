import React from "react";
import { TodoList } from "../components";

export const Todos: React.FC = () => {
  return (
    <div className="mx-auto p-4 w-full">
      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <TodoList />
      </div>
    </div>
  );
};
