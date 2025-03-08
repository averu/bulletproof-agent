import React from "react";
import { useAtom } from "jotai";
import { Todo, statusOptions } from "../../types";
import {
  removeTodoAtom,
  selectedTodoIdAtom,
  showTodoDetailAtom,
  isEditingAtom,
} from "../../stores";
import { Button } from "../../../../components/Elements";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [, removeTodo] = useAtom(removeTodoAtom);
  const [, setSelectedTodoId] = useAtom(selectedTodoIdAtom);
  const [, setShowTodoDetail] = useAtom(showTodoDetailAtom);
  const [, setIsEditing] = useAtom(isEditingAtom);

  const handleRemove = () => {
    removeTodo(todo.id);
  };

  const handleShowDetail = () => {
    setSelectedTodoId(todo.id);
    setShowTodoDetail(true);
  };

  return (
    <tr className={`${todo.status === "done" ? "bg-gray-100" : ""}`}>
      <td className="p-4">
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
          <FiEye />
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setSelectedTodoId(todo.id);
            setShowTodoDetail(true);
            setIsEditing(true);
          }}
          aria-label="Edit todo"
          className="ml-1"
        >
          <FiEdit />
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={handleRemove}
          aria-label="Remove todo"
          className="ml-1"
        >
          <FiTrash2 />
        </Button>
      </td>
    </tr>
  );
};
