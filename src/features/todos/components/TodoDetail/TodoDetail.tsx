import React from "react";
import { Todo, statusOptions } from "../../types/todo";

interface Props {
  todo: Todo;
}

export const TodoDetail: React.FC<Props> = ({ todo }) => {
  return (
    <div className="p-4 text-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{todo.title}</h2>
        <div></div>
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold">Description:</span> {todo.description}
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold">Status:</span> {statusOptions[todo.status]}
      </div>
    </div>
  );
};

export default TodoDetail;
