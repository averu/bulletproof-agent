import React, { useState, useEffect } from "react";
import { Todo, statusOptions, priorityOptions } from "../../types/todo"; // priorityOptions をインポート
import { getUsers } from "../../../users/utils/user";
import { format } from "date-fns"; // format をインポート
import { ja } from "date-fns/locale"; // ja ロケールをインポート

interface Props {
  todo: Todo;
}

export const TodoDetail: React.FC<Props> = ({ todo }) => {
  const [assigneeName, setAssigneeName] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchAssignee = async () => {
      if (todo.assigneeId) {
        const users = await getUsers();
        const assignee = users.find((user) => user.id === todo.assigneeId);
        setAssigneeName(assignee?.name);
      }
    };

    fetchAssignee();
  }, [todo.assigneeId]);

  return (
    <div className="p-4 text-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{todo.title}</h2>
        <div></div>
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold">説明:</span> {todo.description}
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold">ステータス:</span>{" "}
        {statusOptions[todo.status]}
      </div>
      {/* 優先度表示を追加 */}
      <div className="flex items-center mb-2">
        <span className="font-bold">優先度:</span>{" "}
        {priorityOptions[todo.priority]}
      </div>
      {/* 期日表示を追加 */}
      {todo.dueDate && (
        <div className="flex items-center mb-2">
          <span className="font-bold">期日:</span>{" "}
          {format(todo.dueDate, "yyyy/MM/dd", { locale: ja })}
        </div>
      )}
      <div className="flex items-center mb-2">
        <span className="font-bold">作成者:</span> {todo.name}
      </div>
      {assigneeName && (
        <div className="flex items-center mb-2">
          <span className="font-bold">担当者:</span> {assigneeName}
        </div>
      )}
    </div>
  );
};

export default TodoDetail;
