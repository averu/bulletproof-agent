import React from "react";
import { useAtom } from "jotai";
import {
  incompleteTodosCountAtom,
  hasCompletedTodosAtom,
  clearCompletedTodosAtom,
  toggleAllTodosAtom,
} from "../../stores";
import { Button } from "../../../../components/Elements";

export const TodoStats: React.FC = () => {
  const [incompleteCount] = useAtom(incompleteTodosCountAtom);
  const [hasCompleted] = useAtom(hasCompletedTodosAtom);
  const [, clearCompleted] = useAtom(clearCompletedTodosAtom);
  const [, toggleAll] = useAtom(toggleAllTodosAtom);

  return (
    <div className="flex justify-between items-center py-2 px-4 border-t text-sm text-gray-900">
      <div>
        <span className="font-semibold">{incompleteCount}</span>{" "}
        件の未完了タスク
      </div>
      <div className="flex space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => toggleAll(incompleteCount > 0)}
          className="text-gray-900"
        >
          {incompleteCount > 0 ? "全て完了" : "全て未完了"}
        </Button>
        {hasCompleted && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => clearCompleted()}
          >
            完了済みを削除
          </Button>
        )}
      </div>
    </div>
  );
};
