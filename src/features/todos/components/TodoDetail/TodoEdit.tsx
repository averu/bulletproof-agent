import React, { useState } from "react";
import { Todo, Status } from "../../types/todo";
import { Button } from "../../../../components/Elements";
import { Input } from "../../../../components/Form/Input";

const statusOptions: { [key in Status]: string } = {
  "not-started": "未対応",
  "in-progress": "処理中",
  completed: "処理済み",
  pending: "保留",
  done: "完了",
};

interface Props {
  todo: Todo;
  onSave: (updatedTodo: Todo) => void;
  onCancel: () => void;
}

export const TodoEdit: React.FC<Props> = ({ todo, onSave, onCancel }) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [status, setStatus] = useState(todo.status);

  const handleSave = () => {
    onSave({ ...todo, title, description, status });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Todoの編集</h2>
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <Input
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
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          説明
        </label>
        <Input
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
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {Object.entries(statusOptions).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} variant="primary" className="mr-2">
          保存
        </Button>
        <Button onClick={onCancel} variant="secondary">
          キャンセル
        </Button>
      </div>
    </div>
  );
};
