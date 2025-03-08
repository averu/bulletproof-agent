import React, { useState } from "react";
import { useAtom } from "jotai";
import { Todo, Status, statusOptions } from "../../types/todo";
import { Button } from "../../../../components/Elements";
import { Input } from "../../../../components/Form/Input";
import { todosAtom, showTodoEditAtom } from "../../stores";

interface Props {
  todo: Todo;
}

export const TodoEdit: React.FC<Props> = ({ todo }) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [status, setStatus] = useState(todo.status);
  const [todos, setTodos] = useAtom(todosAtom);
  const [, setShowTodoEdit] = useAtom(showTodoEditAtom);

  const handleSave = (updatedTodo: Todo) => {
    const updatedTodos = (todos || []).map((t) =>
      t.id === updatedTodo.id ? updatedTodo : t
    );
    setTodos(updatedTodos);
    setShowTodoEdit(false);
  };

  const handleCancel = () => {
    setShowTodoEdit(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl text-gray-900 text-center font-bold mb-4">
        Todoの編集
      </h2>
      <div className="mb-4">
        <Input
          label="タイトル"
          id="title"
          type="text"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          className="mt-1 block w-full"
        />
      </div>
      <div className="mb-4">
        <Input
          label="説明"
          id="description"
          type="text"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDescription(e.target.value)
          }
          className="mt-1 block w-full"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          ステータス
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="mt-1 block w-full border text-gray-900 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {Object.entries(statusOptions).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => handleSave({ ...todo, title, description, status })}
          variant="primary"
          className="mr-2"
        >
          保存
        </Button>
        <Button onClick={handleCancel} variant="secondary">
          キャンセル
        </Button>
      </div>
    </div>
  );
};
