import React, { useState, useEffect } from "react";
import { Todo, statusOptions, priorityOptions } from "../../types/todo"; // priorityOptions をインポート
import { getUsers } from "../../../users/utils/user";
import { format } from "date-fns"; // format をインポート
import { ja } from "date-fns/locale"; // ja ロケールをインポート

interface Props {
  todo: Todo | null; // todo が null の可能性も考慮
}

export const TodoDetail: React.FC<Props> = ({ todo }) => {
  const [assigneeName, setAssigneeName] = useState<string | undefined>(
    undefined
  );
  // 担当者名の読み込み状態を管理
  const [isLoadingAssignee, setIsLoadingAssignee] = useState<boolean>(true);

  useEffect(() => {
    // todo が null または assigneeId がない場合は処理しない
    if (!todo || !todo.assigneeId) {
      setAssigneeName(undefined);
      setIsLoadingAssignee(false); // 担当者IDがない場合は即座にロード完了
      return;
    }

    // 担当者取得開始前にローディング状態にする
    setIsLoadingAssignee(true);
    setAssigneeName(undefined); // 念のためリセット

    const fetchAssignee = async () => {
      try {
        const users = await getUsers();
        const assignee = users.find((user) => user.id === todo.assigneeId);
        setAssigneeName(assignee?.name);
      } catch (error) {
        console.error("Failed to fetch assignee:", error);
        setAssigneeName(undefined); // エラー時も未設定
      } finally {
        // 取得完了（成功/失敗問わず）したらローディング解除
        setIsLoadingAssignee(false);
      }
    };

    fetchAssignee();
    // todo.id も依存配列に追加
  }, [todo?.id, todo?.assigneeId]); // todo が null の場合も考慮して optional chaining

  // todo が null の場合は何も表示しない
  if (!todo) {
    return null;
  }

  // 担当者名読み込み中はローディング表示
  if (isLoadingAssignee && todo.assigneeId) {
    // assigneeId がある場合のみローディング表示
    return (
      <div className="p-6 text-gray-900 flex justify-center items-center min-h-[200px]">
        <p>担当者情報を読み込み中...</p>
        {/* ここにスピナーなどを表示しても良い */}
      </div>
    );
  }

  // ローディング完了後に詳細を表示
  return (
    <div className="p-6 text-gray-900">
      {" "}
      {/* 外側のコンテナ */}
      <h2 className="text-xl font-bold mb-1">{todo.title}</h2>
      {/* 作成者をタイトルの下に表示 */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <div>
          <span className="font-medium">作成者:</span> {todo.name}
        </div>
      </div>
      {/* 説明 */}
      <div className="bg-gray-50 p-3 rounded mb-4">
        <span className="block text-sm font-medium text-gray-500 mb-1">
          説明
        </span>
        <p className="text-gray-800 break-words min-h-[6rem]">
          {todo.description || "-"}
        </p>
      </div>
      {/* 他の項目をグリッドレイアウトで表示 */}
      <div className="grid grid-cols-2 gap-4">
        {" "}
        {/* グリッドコンテナ */}
        {/* ステータス */}
        <div className="bg-gray-50 p-3 rounded">
          <span className="block text-sm font-medium text-gray-500 mb-1">
            ステータス
          </span>
          <p className="text-gray-800">{statusOptions[todo.status]}</p>
        </div>
        {/* 担当者 (未設定でも表示) */}
        <div className="bg-gray-50 p-3 rounded">
          <span className="block text-sm font-medium text-gray-500 mb-1">
            担当者
          </span>
          <p className="text-gray-800">{assigneeName || "未設定"}</p>
        </div>
        {/* 優先度 */}
        <div className="bg-gray-50 p-3 rounded">
          <span className="block text-sm font-medium text-gray-500 mb-1">
            優先度
          </span>
          <p className="text-gray-800">
            {priorityOptions[todo.priority ?? "unset"]}
          </p>
        </div>
        {/* 期日 (未設定でも表示) */}
        <div className="bg-gray-50 p-3 rounded">
          <span className="block text-sm font-medium text-gray-500 mb-1">
            期日
          </span>
          <p className="text-gray-800">
            {todo.dueDate
              ? format(todo.dueDate, "yyyy/MM/dd", { locale: ja })
              : "未設定"}
          </p>
        </div>
      </div>{" "}
      {/* グリッドコンテナを閉じる */}
    </div>
  );
};

export default TodoDetail;
