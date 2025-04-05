import React from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  searchedTodosAtom, // sortedTodosAtom から変更
  sortTypeAtom,
  filterTypeAtom, // 0件メッセージ用に必要
  searchTermAtom, // 0件メッセージ用に必要
  selectedTodoIdAtom,
  showTodoDetailAtom,
  showTodoEditAtom,
} from "../../stores";
import { TodoItem } from "../TodoItem";
import { TodoDetail } from "../TodoDetail";
import { SortButton } from "@/components/Elements/SortButton"; // 相対パスからエイリアスに変更 (想定)
import { Modal } from "@/components/Elements"; // Button を削除
// import { Input } from "@/components/Form"; // Input を削除
import { TodoFilterControls } from "../TodoFilterControls"; // 追加
import { authState } from "@/features/users/stores/userAtoms"; // エイリアスに変更 (想定)
import { TodoEdit } from "../TodoEdit";

export const TodoList: React.FC = () => {
  const searchedTodos = useAtomValue(searchedTodosAtom); // sortedTodosAtom から変更
  const [sortType, setSortType] = useAtom(sortTypeAtom);
  const filterType = useAtomValue(filterTypeAtom); // 0件メッセージ用に値のみ取得
  const searchTerm = useAtomValue(searchTermAtom); // 0件メッセージ用に値のみ取得
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

  // searchedTodos は初期値が空配列なので、ローディング表示は todosAtom を直接見るか、別途ローディング状態を持つ必要がある
  // ここでは簡略化のためローディング表示を一旦削除 (必要なら別途実装)
  // if (!todos) {
  //   return <div className="p-4 text-gray-900 text-center">Loading...</div>;
  // }

  const selectedTodo = searchedTodos.find((todo) => todo.id === selectedTodoId); // todos から変更

  // フィルタリング/検索結果が0件の場合の表示
  const noTodosMessage =
    filterType.length === 0 && !searchTerm // filterType が空配列かどうかで判断
      ? "タスクがありません。新しいタスクを追加してください。"
      : "該当するタスクが見つかりません。";

  // 0件チェックはテーブルボディ内で行うため、ここでの早期リターンは削除
  // if (searchedTodos.length === 0) {
  //   return (
  //     <div className="p-4 text-gray-900 text-center">{noTodosMessage}</div>
  //   );
  // }

  return (
    // 全体を囲む div は不要になる場合があるが、一旦残す
    // <div className="border rounded-md overflow-hidden shadow-sm">
    <div>
      {" "}
      {/* React Fragment から div に戻す */}
      {/* フィルターと検索コントロール */}
      <TodoFilterControls />
      {/* Todo テーブル */}
      <div className="border rounded-md overflow-hidden shadow-sm">
        {" "}
        {/* テーブルとモーダルを囲む div */}
        {/* Todo テーブル */}
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
            {searchedTodos.length === 0 ? (
              <tr>
                {/* テーブルのカラム数に合わせて colspan を設定 */}
                <td
                  colSpan={7} // タイトル、作成者、担当者、ステータス、作成日、更新日、操作 の7カラム
                  className="p-4 text-center text-gray-500"
                >
                  {noTodosMessage}
                </td>
              </tr>
            ) : (
              searchedTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))
            )}
          </tbody>
        </table>
        {/* モーダル */}
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
      </div>{" "}
      {/* 89行目の div を閉じる */}
    </div> // 84行目の div を閉じる
  );
};
