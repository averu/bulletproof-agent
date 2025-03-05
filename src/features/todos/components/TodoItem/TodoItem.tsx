import React from "react";
import { useAtom } from "jotai";
import { Todo, statusOptions } from "../../types";
import {
  removeTodoAtom,
  selectedTodoIdAtom,
  showTodoDetailAtom,
} from "../../stores";
import { Button } from "../../../../components/Elements";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface TodoItemProps {
  todo: Todo;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isSelected,
  onToggleSelect,
}) => {
  const [, removeTodo] = useAtom(removeTodoAtom);
  const [, setSelectedTodoId] = useAtom(selectedTodoIdAtom);
  const [, setShowTodoDetail] = useAtom(showTodoDetailAtom);

  const handleRemove = () => {
    removeTodo(todo.id);
  };

  const handleShowDetail = () => {
    setSelectedTodoId(todo.id);
    setShowTodoDetail(true);
  };

  const handleCheckboxChange = () => {
    onToggleSelect(todo.id);
  };

  return (
    <tr className={`${todo.status === "done" ? "bg-gray-100" : ""}`}>
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className="mr-2"
        />
        <span
          className={`text-gray-800 ${
            todo.deleted ? "line-through text-gray-500" : ""
          }`}
        >
          {todo.title}
        </span>
      </td>
      <td className="p-4 text-gray-500">{statusOptions[todo.status]}</td>
      <td className="p-4 text-gray-500">
        {format(todo.createdAt, "yyyy/MM/dd HH:mm", { locale: ja })}
      </td>
      <td className="p-4 text-gray-500">
        {format(todo.updatedAt, "yyyy/MM/dd HH:mm", { locale: ja })}
      </td>
      <td className="p-4 flex justify-end">
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
      </td>
    </tr>
  );
};
