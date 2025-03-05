import React from "react";
import { useAtom } from "jotai";
import { Todo } from "../../types";
import {
  toggleTodoAtom,
  removeTodoAtom,
  selectedTodoIdAtom,
  showTodoDetailAtom,
} from "../../stores";
import { Button } from "../../../../components/Elements";
import { Checkbox } from "../../../../components/Form";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [, toggleTodo] = useAtom(toggleTodoAtom);
  const [, removeTodo] = useAtom(removeTodoAtom);
  const [, setSelectedTodoId] = useAtom(selectedTodoIdAtom);
  const [, setShowTodoDetail] = useAtom(showTodoDetailAtom);

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleRemove = () => {
    removeTodo(todo.id);
  };

  const handleShowDetail = () => {
    setSelectedTodoId(todo.id);
    setShowTodoDetail(true);
  };

  return (
    <div className="flex items-center p-4">
      <Checkbox
        checked={todo.completed}
        onChange={handleToggle}
        className="mr-2"
      />
      <span
        className={`text-gray-800 flex-1 w-48 overflow-hidden text-ellipsis whitespace-nowrap ${
          todo.completed ? "line-through text-gray-500" : ""
        }`}
      >
        {todo.title}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleShowDetail}
        aria-label="Show todo detail"
        className="ml-1"
      >
        詳細
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={handleRemove}
        aria-label="Remove todo"
        className="ml-1"
      >
        削除
      </Button>
    </div>
  );
};
