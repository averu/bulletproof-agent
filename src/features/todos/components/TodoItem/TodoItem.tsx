import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { Todo, statusOptions } from "../../types";
import {
  removeTodoAtom,
  selectedTodoIdAtom,
  showTodoDetailAtom,
  showTodoEditAtom,
} from "../../stores";
import { Button } from "../../../../components/Elements";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { getUsers } from "../../../../features/users/utils/user";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [, removeTodo] = useAtom(removeTodoAtom);
  const [, setSelectedTodoId] = useAtom(selectedTodoIdAtom);
  const [, setShowTodoDetail] = useAtom(showTodoDetailAtom);
  const [, setShowTodoEdit] = useAtom(showTodoEditAtom);
  const [assigneeName, setAssigneeName] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      if (fetchedUsers) {
        const assignee = fetchedUsers.find(
          (user) => user.id === todo.assigneeId
        );
        setAssigneeName(assignee?.name || "");
      }
    };
    fetchUsers();
  }, [todo.assigneeId]);

  const handleRemove = () => {
    removeTodo(todo.id);
  };

  const handleShowDetail = () => {
    setSelectedTodoId(todo.id);
    setShowTodoDetail(true);
    setShowTodoEdit(false);
  };

  const handleShowEdit = () => {
    setSelectedTodoId(todo.id);
    setShowTodoDetail(false);
    setShowTodoEdit(true);
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
      <td className="p-4">
        <span
          className={`text-gray-800 ${
            todo.deleted ? "line-through text-gray-500" : ""
          }`}
        >
          {todo.name}
        </span>
      </td>
      <td className="p-4">
        <span className="text-gray-800">{assigneeName}</span>
      </td>
      <td className="p-4 text-gray-500">{statusOptions[todo.status]}</td>
      <td className="p-4 text-gray-500">
        {format(todo.createdAt, "yyyy/MM/dd", { locale: ja })}
      </td>
      <td className="p-4 text-gray-500">
        {format(todo.updatedAt, "yyyy/MM/dd", { locale: ja })}
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
          onClick={handleShowEdit}
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
