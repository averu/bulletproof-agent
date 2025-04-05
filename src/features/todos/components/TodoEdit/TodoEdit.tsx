import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { Todo, Status, statusOptions } from "../../types/todo";
import { Button } from "../../../../components/Elements";
import { Input } from "../../../../components/Form/Input";
import { Textarea } from "../../../../components/Form/Textarea";
import { todosAtom, showTodoEditAtom } from "../../stores";
import { getUsers } from "../../../../features/users/utils/user";

interface Props {
  todo: Todo;
}

export const TodoEdit: React.FC<Props> = ({ todo }) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [status, setStatus] = useState(todo.status);
  const [assigneeId, setAssigneeId] = useState(todo.assigneeId || "");
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false); // ローディング状態を追加
  const [todos, setTodos] = useAtom(todosAtom);
  const [, setShowTodoEdit] = useAtom(showTodoEditAtom);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true); // データ取得開始時にローディングをtrueにする
      const fetchedUsers = await getUsers();
      if (fetchedUsers) {
        setUsers(
          fetchedUsers.map((user) => ({ id: user.id, name: user.name || "" }))
        );
      }
      setIsLoading(false); // データ取得完了時にローディングをfalseにする
    };
    fetchUsers();
  }, []);

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
        <Textarea
          label="説明"
          id="description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
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
      <div className="mb-4">
        <label
          htmlFor="assignee"
          className="block text-sm font-medium text-gray-700"
        >
          担当者
        </label>
        {isLoading ? ( // ローディング中はローディング表示
          <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm">
            読み込み中...
          </div>
        ) : (
          <select
            id="assignee"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border text-gray-700 border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">担当者なし</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() =>
            handleSave({
              ...todo,
              title,
              description,
              status,
              assigneeId,
              updatedAt: new Date(),
            })
          }
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
