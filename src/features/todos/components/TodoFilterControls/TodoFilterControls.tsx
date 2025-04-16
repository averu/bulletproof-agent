import React, { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import {
  filterTypeAtom,
  searchTermAtom,
  filterAssigneeIdAtom,
  filterStartDateAtom,
  filterEndDateAtom,
} from "../../stores";
import { statusOptions, Status } from "../../types";
import { Button } from "@/components/Elements";
import { Input } from "@/components/Form";
import { AiOutlineDown, AiOutlinePlus } from "react-icons/ai"; // AiOutlinePlus をインポート
import { getUsers } from "../../../users/utils/user";
import Modal from "@/components/Elements/Modal"; // Modal をインポート
import { TodoAdd } from "../TodoAdd/TodoAdd"; // TodoAdd をインポート

export const TodoFilterControls: React.FC = () => {
  const [filterType, setFilterType] = useAtom(filterTypeAtom);
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [filterAssigneeId, setFilterAssigneeId] = useAtom(filterAssigneeIdAtom);
  const [filterStartDate, setFilterStartDate] = useAtom(filterStartDateAtom);
  const [filterEndDate, setFilterEndDate] = useAtom(filterEndDateAtom);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 追加モーダル用 state
  const allStatuses = Object.keys(statusOptions) as Status[];
  const dropdownRef = useRef<HTMLDivElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);

  // ユーザーリストを取得
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

  // ドロップダウンの外側クリックで閉じる処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        statusButtonRef.current &&
        !statusButtonRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, statusButtonRef]);

  // ステータスチェックボックス変更時の処理
  const handleStatusChange = (status: Status) => {
    setFilterType((prev) => {
      const newFilter = new Set(prev);
      if (newFilter.has(status)) {
        newFilter.delete(status);
      } else {
        newFilter.add(status);
      }
      return Array.from(newFilter);
    });
  };

  // 「すべて選択/解除」処理
  const handleToggleAllStatuses = () => {
    if (isAllSelected) {
      setFilterType([]);
    } else {
      setFilterType(allStatuses);
    }
  };

  // 担当者プルダウン変更時の処理
  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterAssigneeId(e.target.value);
  };

  // 開始日変更時の処理
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterStartDate(e.target.value || null);
  };

  // 終了日変更時の処理
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterEndDate(e.target.value || null);
  };

  // 追加モーダルを開く処理
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  // 追加モーダルを閉じる処理
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // すべて選択されているかどうかの判定
  const isAllSelected = filterType.length === allStatuses.length;
  // 選択されているステータスの数を取得
  const selectedCount = filterType.length;

  return (
    <>
      {" "}
      {/* Fragment で囲む */}
      <div className="p-4 bg-gray-50 border rounded-md mb-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-x-4 gap-y-2">
        {/* ステータスフィルターと追加ボタン */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {" "}
          {/* flex-shrink-0 を追加 */}
          {/* ステータスフィルター (ドロップダウン形式) */}
          <div
            className="relative inline-block text-left w-full sm:w-auto"
            ref={dropdownRef}
          >
            <div>
              <Button
                ref={statusButtonRef}
                type="button"
                variant="secondary"
                size="sm"
                className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <span>
                  ステータス:{" "}
                  {selectedCount === 0
                    ? "すべて"
                    : selectedCount === allStatuses.length
                    ? "すべて"
                    : `${selectedCount}件選択`}
                </span>
                <AiOutlineDown className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </div>

            {/* ドロップダウンメニュー */}
            {isStatusDropdownOpen && (
              <div className="origin-top-left absolute left-0 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                <div
                  className="py-1 px-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {/* すべて選択/解除 チェックボックス */}
                  <div className="flex items-center px-2 py-1 rounded hover:bg-gray-100">
                    <input
                      type="checkbox"
                      id="filter-dd-all"
                      checked={isAllSelected}
                      onChange={handleToggleAllStatuses}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label
                      htmlFor="filter-dd-all"
                      className="ml-2 block text-sm text-gray-900 flex-grow cursor-pointer"
                    >
                      <span>すべて選択/解除</span>
                    </label>
                  </div>
                  <hr className="my-1" />
                  {/* ステータスチェックボックス */}
                  {allStatuses.map((statusKey) => (
                    <div
                      key={statusKey}
                      className="flex items-center px-2 py-1 rounded hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        id={`filter-dd-${statusKey}`}
                        checked={filterType.includes(statusKey)}
                        onChange={() => handleStatusChange(statusKey)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <label
                        htmlFor={`filter-dd-${statusKey}`}
                        className="ml-2 block text-sm text-gray-900 flex-grow cursor-pointer"
                      >
                        {statusOptions[statusKey]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* 追加ボタン */}
          <Button
            onClick={handleOpenAddModal}
            variant="primary" // プライマリボタンに変更
            size="sm"
            className="flex items-center space-x-1"
          >
            <AiOutlinePlus className="h-4 w-4" />
            <span>追加</span>
          </Button>
        </div>

        {/* その他のフィルター (担当者、期間、検索) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:ml-auto flex-wrap">
          {/* 担当者プルダウン */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <label
              htmlFor="assignee-filter"
              className="text-sm text-gray-700 flex-shrink-0"
            >
              担当者:
            </label>
            <select
              id="assignee-filter"
              value={filterAssigneeId}
              onChange={handleAssigneeChange}
              className="block w-full sm:w-auto py-2 px-3 border text-gray-700 border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-full"
            >
              <option value="">すべて</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* 期間指定 */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <label
              htmlFor="start-date-filter"
              className="text-sm text-gray-700 flex-shrink-0"
            >
              期間:
            </label>
            <Input
              type="date"
              id="start-date-filter"
              value={filterStartDate ?? ""}
              onChange={handleStartDateChange}
              className="h-full w-auto"
              aria-label="開始日"
            />
            <span className="text-gray-500">～</span>
            <Input
              type="date"
              id="end-date-filter"
              value={filterEndDate ?? ""}
              onChange={handleEndDateChange}
              className="h-full w-auto"
              aria-label="終了日"
              min={filterStartDate ?? undefined}
            />
          </div>

          {/* 検索インプット */}
          <div className="flex-grow min-w-[150px]">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
      {/* 追加モーダル */}
      <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal}>
        <TodoAdd />
      </Modal>
    </>
  );
};
