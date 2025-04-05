import React from "react";
import { useAtom } from "jotai";
import { filterTypeAtom, searchTermAtom } from "../../stores";
import { statusOptions, Status } from "../../types"; // statusOptions と Status をインポート
// import { Button } from "@/components/Elements"; // Button は不要になる
import { Input } from "@/components/Form";

export const TodoFilterControls: React.FC = () => {
  const [filterType, setFilterType] = useAtom(filterTypeAtom);
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);

  // ステータスボタンクリック時の処理
  const handleStatusClick = (status: Status) => {
    setFilterType((prev) => {
      const newFilter = new Set(prev); // Set を使って重複を管理
      if (newFilter.has(status)) {
        newFilter.delete(status); // 既に選択されていれば削除
      } else {
        newFilter.add(status); // 選択されていなければ追加
      }
      return Array.from(newFilter); // Set から配列に戻して更新
    });
  };

  // 古い定義とコメントは削除

  return (
    <div className="p-4 bg-gray-50 border rounded-md mb-4 shadow-sm flex items-center space-x-4">
      <div className="flex flex-wrap gap-2">
        {" "}
        {/* space-x-2 を削除 */}
        {/* flex-wrap と gap を追加 */}
        {/* 「すべて」ボタンは削除 */}
        {/* statusOptions からチェックボックスを生成 */}
        {(Object.keys(statusOptions) as Status[]).map((statusKey) => (
          <div key={statusKey} className="flex items-center">
            <input
              type="checkbox"
              id={`filter-${statusKey}`} // label の htmlFor と対応させる
              checked={filterType.includes(statusKey)} // includes でチェック状態を確認
              onChange={() => handleStatusClick(statusKey)} // 変更時にハンドラを呼び出す
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" // Tailwind スタイル
            />
            <label
              htmlFor={`filter-${statusKey}`}
              className="ml-2 block text-sm text-gray-900" // Tailwind スタイル
            >
              {statusOptions[statusKey]} {/* ラベルを statusOptions から取得 */}
            </label>
          </div>
        ))}
      </div>
      <div className="flex-grow">
        <Input
          type="text"
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};
