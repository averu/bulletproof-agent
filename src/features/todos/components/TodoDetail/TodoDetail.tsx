import React, { useState } from "react";
import { useAtom } from "jotai";
import { Todo, Status } from "../../types/todo";
import { showTodoDetailAtom, todosAtom } from "../../stores";
import { Button } from "../../../../components/Elements";
import { TodoEdit } from "./TodoEdit";

const statusOptions: { [key in Status]: string } = {
  "not-started": "未対応",
  "in-progress": "処理中",
  completed: "処理済み",
  pending: "保留",
  done: "完了",
};

interface Props {
  todo: Todo;
}

export const TodoDetail: React.FC<Props> = ({ todo }) => {
  const [, setShowTodoDetail] = useAtom(showTodoDetailAtom);
  const [todos, setTodos] = useAtom(todosAtom);
  const [isEditing, setIsEditing] = useState(false);

  const handleClose = () => {
    setShowTodoDetail(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedTodo: Todo) => {
    const updatedTodos = (todos || []).map((t) =>
      t.id === updatedTodo.id ? updatedTodo : t
    );
    setTodos(updatedTodos);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4">
      {isEditing ? (
        <TodoEdit todo={todo} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{todo.title}</h2>
            <div>
              <Button
                onClick={handleEdit}
                variant="primary"
                size="sm"
                className="mr-2"
              >
                編集
              </Button>
              <Button onClick={handleClose} variant="secondary" size="sm">
                閉じる
              </Button>
            </div>
          </div>
          <div className="flex items-center mb-2">
            <span className="font-bold">Description:</span> {todo.description}
          </div>
          <div className="flex items-center mb-2">
            <span className="font-bold">Status:</span>{" "}
            {statusOptions[todo.status]}
          </div>
        </>
      )}
    </div>
  );
};

export default TodoDetail;
