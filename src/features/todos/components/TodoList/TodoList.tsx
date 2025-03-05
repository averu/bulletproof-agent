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
      {todos.map((todo: Todo, index: number) => {
        return (
          <React.Fragment key={todo.id}>
            <TodoItem todo={todo} />
            {todos.length > 1 && index < todos.length - 1 && (
              <hr className="border-gray-300" />
            )}
          </React.Fragment>
        );
      })}
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
