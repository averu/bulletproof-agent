import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import {
  Todo,
  Status,
  statusOptions,
  Priority,
  priorityOptions,
} from "../../types/todo"; // Priority, priorityOptions を追加
import { Button } from "../../../../components/Elements";
import { Input } from "../../../../components/Form/Input";
import { Textarea } from "../../../../components/Form/Textarea";
import { showTodoEditAtom, updateTodoAtom } from "../../stores"; // updateTodoAtom を追加, todosAtom を削除
import { getUsers } from "../../../../features/users/utils/user";
import { format } from "date-fns"; // format を追加

interface Props {
  todo: Todo;
}

export const TodoEdit: React.FC<Props> = ({ todo }) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [status, setStatus] = useState(todo.status);
  const [assigneeId, setAssigneeId] = useState(todo.assigneeId || "");
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [priority, setPriority] = useState<Priority>(todo.priority); // 優先度 state 追加
  // dueDate は yyyy-MM-dd 形式の文字列で保持 (input type="date" のため)
  const [dueDate, setDueDate] = useState<string>(
    todo.dueDate ? format(todo.dueDate, "yyyy-MM-dd") : ""
  );
  const [isLoading, setIsLoading] = useState(false); // ローディング状態を追加
  // const [todos, setTodos] = useAtom(todosAtom); // 直接 todosAtom を更新せず updateTodoAtom を使う
  const [, updateTodo] = useAtom(updateTodoAtom); // updateTodoAtom を使う
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

  const handleSave = () => {
    // updateTodoAtom に渡すオブジェクトを作成
    const updateData = {
      id: todo.id,
      title,
      description,
      status,
      priority, // 追加
      dueDate: dueDate ? new Date(dueDate) : null, // Date or null に変換
      assigneeId: assigneeId || undefined,
    };
    updateTodo(updateData); // updateTodoAtom を呼び出す
    setShowTodoEdit(false); // モーダルを閉じる
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

      {/* 優先度 */}
      <div className="mb-4">
        <label
          htmlFor="priority-edit" // id を変更
          className="block text-sm font-medium text-gray-700"
        >
          優先度
        </label>
        <select
          id="priority-edit" // id を変更
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="mt-1 block w-full py-2 px-3 border text-gray-700 border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {(Object.keys(priorityOptions) as Priority[]).map((p) => (
            <option key={p} value={p}>
              {priorityOptions[p]}
            </option>
          ))}
        </select>
      </div>

      {/* 期日 */}
      <div className="mb-4">
        <label
          htmlFor="dueDate-edit" // id を変更
          className="block text-sm font-medium text-gray-700"
        >
          期日
        </label>
        <Input
          type="date"
          id="dueDate-edit" // id を変更
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave} // 引数なしで呼び出すように変更
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
