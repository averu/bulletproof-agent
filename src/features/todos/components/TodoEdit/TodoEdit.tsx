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
import { format, addDays } from "date-fns"; // format, addDays を追加

interface Props {
  todo: Todo;
}

export const TodoEdit: React.FC<Props> = ({ todo }) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [status, setStatus] = useState(todo.status);
  const [assigneeId, setAssigneeId] = useState(todo.assigneeId || "");
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [priority, setPriority] = useState<Priority | null>(todo.priority); // 優先度 state 追加 (null 許容)
  // 期日の初期値を計算 (1週間後)
  const defaultDueDate = format(addDays(new Date(), 7), "yyyy-MM-dd");
  // dueDate は yyyy-MM-dd 形式の文字列で保持 (input type="date" のため)
  // 既存の期日があればそれを、なければデフォルト値を使用
  const [dueDate, setDueDate] = useState<string>(
    todo.dueDate ? format(todo.dueDate, "yyyy-MM-dd") : defaultDueDate
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
    <div className="p-4 space-y-4">
      {" "}
      {/* space-y-4 を追加 */}
      <h2 className="text-xl text-gray-900 font-bold">
        {" "}
        {/* text-center, mb-4 を削除 */}
        Todoの編集
      </h2>
      {/* タイトル */}
      <div>
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
      {/* 説明 */}
      <div>
        <Textarea
          label="説明"
          id="description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          className="mt-1 block w-full min-h-[6rem]" // min-h-[6rem] を追加
        />
      </div>
      {/* グリッドレイアウト */}
      <div className="grid grid-cols-2 gap-4">
        {/* ステータス */}
        <div>
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

        {/* 担当者 */}
        <div>
          <label
            htmlFor="assignee"
            className="block text-sm font-medium text-gray-700"
          >
            担当者
          </label>
          {isLoading ? ( // ローディング中はローディング表示
            <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm sm:text-sm text-gray-500">
              {" "}
              {/* 背景色と文字色を調整 */}
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
        <div>
          <label
            htmlFor="priority-edit" // id を変更
            className="block text-sm font-medium text-gray-700"
          >
            優先度
          </label>
          <select
            id="priority-edit" // id を変更
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
      </div>{" "}
      {/* グリッドレイアウト終了 */}
      <div className="flex justify-end mt-4">
        {" "}
        {/* ボタンコンテナに mt-4 を追加 */}
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
