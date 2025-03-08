import React from "react";
import { useAtom } from "jotai";
import { Todo, statusOptions } from "../../types/todo";
import { todosAtom, isEditingAtom, showTodoDetailAtom } from "../../stores";
import { TodoEdit } from "./TodoEdit";

interface Props {
  todo: Todo;
}

export const TodoDetail: React.FC<Props> = ({ todo }) => {
  const [todos, setTodos] = useAtom(todosAtom);
  const [isEditing, setIsEditing] = useAtom(isEditingAtom);
  const [, setShowTodoDetail] = useAtom(showTodoDetailAtom);

  const handleSave = (updatedTodo: Todo) => {
    const updatedTodos = (todos || []).map((t) =>
      t.id === updatedTodo.id ? updatedTodo : t
    );
    setTodos(updatedTodos);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowTodoDetail(false);
  };

  return (
    <div className="p-4">
      {isEditing ? (
        <TodoEdit todo={todo} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{todo.title}</h2>
            <div></div>
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
