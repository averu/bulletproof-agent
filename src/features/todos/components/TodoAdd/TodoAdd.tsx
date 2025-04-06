import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Button } from "../../../../components/Elements";
import { Input, Textarea } from "../../../../components/Form";
import { authState } from "../../../../features/users/stores/userAtoms";
import { getUsers } from "../../../../features/users/utils/user"; // 修正
import { addTodoAtom } from "../../stores";
import { priorityOptions, Priority } from "../../types"; // 追加

export const TodoAdd: React.FC = () => {
  const { user } = useAtomValue(authState);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [priority, setPriority] = useState<Priority>("medium"); // 優先度の状態を追加 (デフォルト: medium)
  const [dueDate, setDueDate] = useState<string>(""); // 期日の状態を追加 (文字列で保持)
  const [, addTodo] = useAtom(addTodoAtom);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      if (fetchedUsers) {
        setUsers(
          fetchedUsers.map((user) => ({ id: user.id, name: user.name || "" }))
        );
      }
    };
    fetchUsers();
  }, []);

  const handleAddTodo = () => {
    if (!title.trim()) return;

    addTodo({
      title: title.trim(),
      description: description.trim(),
      status: "not-started",
      deleted: false,
      userId: user?.id || "",
      name: user?.name || "",
      assigneeId: assigneeId || undefined, // 空文字列なら undefined
      priority: priority, // 追加
      dueDate: dueDate ? new Date(dueDate) : null, // 追加 (Dateオブジェクトまたはnullに変換)
    });

    setTitle("");
    setDescription("");
    setAssigneeId("");
    setPriority("medium"); // フォームリセット
    setDueDate(""); // フォームリセット
  };

  return (
    <div>
      <h2 className="text-xl text-gray-900 font-bold mb-4">Todo追加</h2>
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいタスクを入力..."
          aria-label="新しいタスク"
          className="mt-1"
        />
      </div>
      <div className="mb-4">
        <Textarea
          label="詳細"
          id="description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          placeholder="タスクの詳細を入力..."
          aria-label="タスクの詳細"
          rows={3}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="assignee"
          className="block text-sm font-medium text-gray-700"
        >
          担当者
        </label>
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
      </div>

      {/* 優先度 */}
      <div className="mb-4">
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700"
        >
          優先度
        </label>
        <select
          id="priority"
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
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700"
        >
          期日
        </label>
        <Input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1"
        />
      </div>

      <Button onClick={handleAddTodo} disabled={!title.trim()}>
        登録
      </Button>
    </div>
  );
};
