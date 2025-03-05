import React from "react";
import { useAtom } from "jotai";
import {
  todosAtom,
  selectedTodoIdAtom,
  showTodoDetailAtom,
} from "../../stores";
import { TodoItem } from "../TodoItem";
import { Todo } from "../../types/todo";
import { TodoDetail } from "../TodoDetail";
import { Modal } from "../../../../components/Elements";

export const TodoList: React.FC = () => {
  const [todos] = useAtom(todosAtom);
  const [selectedTodoId, setSelectedTodoId] = useAtom(selectedTodoIdAtom);
  const [showTodoDetail, setShowTodoDetail] = useAtom(showTodoDetailAtom);

  if (!todos) {
    return <div className="p-4 text-gray-900 text-center">Loading...</div>;
  }

  const selectedTodo = todos.find((todo) => todo.id === selectedTodoId);

  if (todos.length === 0) {
    return (
      <div className="p-4 text-gray-900 text-center">
        タスクがありません。新しいタスクを追加してください。
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left text-sm font-bold text-gray-700">
              タイトル
            </th>
            <th className="p-4 text-left text-sm font-bold text-gray-700">
              ステータス
            </th>
            <th className="p-4 text-left text-sm font-bold text-gray-700">
              作成日
            </th>
            <th className="p-4 text-left text-sm font-bold text-gray-700">
              更新日
            </th>
            <th className="p-4 text-right text-sm font-bold text-gray-700">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo: Todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={showTodoDetail && !!selectedTodo}
        onClose={() => {
          setShowTodoDetail(false);
          setSelectedTodoId(null);
        }}
      >
        {selectedTodo && <TodoDetail todo={selectedTodo} />}
      </Modal>
    </div>
  );
};
