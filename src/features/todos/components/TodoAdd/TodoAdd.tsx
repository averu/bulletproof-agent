import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Button } from "../../../../components/Elements";
import { Input, Textarea } from "../../../../components/Form";
import { authState } from "../../../../features/users/stores/userAtoms";
import { getUsers } from "../../../../features/users/utils/user"; // 修正
import { addTodoAtom } from "../../stores";

export const TodoAdd: React.FC = () => {
  const { user } = useAtomValue(authState);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
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
      assigneeId: assigneeId,
    });

    setTitle("");
    setDescription("");
    setAssigneeId("");
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
      <Button onClick={handleAddTodo} disabled={!title.trim()}>
        登録
      </Button>
    </div>
  );
};
