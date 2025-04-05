import React from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  sortedTodosAtom,
  sortTypeAtom,
  selectedTodoIdAtom,
  showTodoDetailAtom,
  showTodoEditAtom,
} from "../../stores";
import { TodoItem } from "../TodoItem";
import { TodoDetail } from "../TodoDetail";
import { SortButton } from "../../../../components/Elements/SortButton";
import { Modal } from "../../../../components/Elements";
import { authState } from "../../../../features/users/stores/userAtoms";
import { TodoEdit } from "../TodoEdit";

export const TodoList: React.FC = () => {
  const [todos] = useAtom(sortedTodosAtom);
  const [sortType, setSortType] = useAtom(sortTypeAtom);
  const { user } = useAtomValue(authState);
  const [selectedTodoId, setSelectedTodoId] = useAtom(selectedTodoIdAtom);
  const [showTodoDetail, setShowTodoDetail] = useAtom(showTodoDetailAtom);
  const [showTodoEdit, setShowTodoEdit] = useAtom(showTodoEditAtom);

  const updateSortType = (
    prevSortType: {
      sortType: "createdAt" | "title" | null;
      sortOrder: "asc" | "desc" | "none";
    },
    targetType: "createdAt" | "title"
  ): {
    sortType: "createdAt" | "title" | null;
    sortOrder: "asc" | "desc" | "none";
  } => {
    if (prevSortType.sortType === targetType) {
      if (prevSortType.sortOrder === "asc") {
        return { sortType: targetType, sortOrder: "desc" };
      } else {
        return { sortType: targetType, sortOrder: "asc" };
      }
    } else {
      return { sortType: targetType, sortOrder: "asc" };
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-gray-900 text-center">
        Please sign in to view your todos.
      </div>
    );
  }

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
              <SortButton
                sortType={sortType}
                setSortType={(targetType) =>
                  setSortType((prev) => updateSortType(prev, targetType))
                }
                targetType="title"
                label="タイトル"
                isActive={sortType.sortType === "title"}
              />
            </th>
            <th className="p-4 text-left text-sm font-bold text-gray-700">
              作成者
            </th>
            <th className="p-4 text-left text-sm font-bold text-gray-700">
              担当者
            </th>
            <th className="p-4 text-left text-sm font-bold text-gray-700">
              ステータス
            </th>
            <th className="p-4 text-left text-sm font-bold text-gray-700">
              <SortButton
                sortType={sortType}
                setSortType={(targetType) =>
                  setSortType((prev) => updateSortType(prev, targetType))
                }
                targetType="createdAt"
                label="作成日"
                isActive={sortType.sortType === "createdAt"}
              />
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
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={(showTodoDetail || showTodoEdit) && !!selectedTodo}
        onClose={() => {
          setShowTodoDetail(false);
          setShowTodoEdit(false);
          setSelectedTodoId(null);
        }}
      >
        {showTodoDetail && selectedTodo && <TodoDetail todo={selectedTodo} />}
        {showTodoEdit && selectedTodo && <TodoEdit todo={selectedTodo} />}
      </Modal>
    </div>
  );
};
