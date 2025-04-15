import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Button } from "../../../../components/Elements";
import { Input, Textarea } from "../../../../components/Form";
import { authState } from "../../../../features/users/stores/userAtoms";
import { getUsers } from "../../../../features/users/utils/user"; // 修正
import { addTodoAtom } from "../../stores";
import { priorityOptions, Priority } from "../../types"; // 追加
import { addDays, format } from "date-fns"; // addDays と format を追加

export const TodoAdd: React.FC = () => {
  const { user } = useAtomValue(authState);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [priority, setPriority] = useState<Priority | null>(null); // 優先度の状態を追加 (デフォルト: null)
  // 期日の初期値を1週間後に設定
  const defaultDueDate = format(addDays(new Date(), 7), "yyyy-MM-dd");
  const [dueDate, setDueDate] = useState<string>(defaultDueDate); // 期日の状態を追加 (文字列で保持)
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
    setPriority(null); // フォームリセット (null に)
    setDueDate(defaultDueDate); // フォームリセット時も初期値に戻す
  };

  return (
    <div className="space-y-4">
      {" "}
      {/* 各要素間のスペースを追加 */}
      <h2 className="text-xl text-gray-900 font-bold">Todo追加</h2>
      {/* タイトル */}
      <div>
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
      {/* 説明 */}
      <div>
        <Textarea
          label="説明"
          id="description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          placeholder="タスクの説明を入力..."
          aria-label="タスクの説明"
          rows={3}
          className="min-h-[6rem]" // 最小高さを設定
        />
      </div>
      {/* グリッドレイアウト */}
      <div className="grid grid-cols-2 gap-4">
        {/* 担当者 */}
        <div>
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
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            優先度
          </label>
          <select
            id="priority"
            value={priority ?? ""} // null の場合は空文字列を value に設定
            onChange={
              (e) =>
                setPriority(
                  e.target.value === "" ? null : (e.target.value as Priority)
                ) // 空文字列なら null を設定
            }
            className="mt-1 block w-full py-2 px-3 border text-gray-700 border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {/* 未設定オプションを追加 */}
            <option value="">{priorityOptions["unset"]}</option>
            {/* NonNullable で null を除外してループ */}
            {(
              Object.keys(priorityOptions).filter(
                (k) => k !== "unset"
              ) as NonNullable<Priority>[]
            ).map((p) => (
              <option key={p} value={p}>
                {priorityOptions[p]}
              </option>
            ))}
          </select>
        </div>

        {/* 期日 */}
        <div>
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
      </div>{" "}
      {/* グリッドレイアウト終了 */}
      <Button onClick={handleAddTodo} disabled={!title.trim()} className="mt-4">
        {" "}
        {/* ボタンにマージントップを追加 */}
        登録
      </Button>
    </div>
  );
};
