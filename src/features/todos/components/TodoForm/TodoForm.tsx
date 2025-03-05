import React, { useState } from "react";
import { useAtom } from "jotai";
import { addTodoAtom } from "../../stores";
import { Input } from "../../../../components/Form";
import { Button } from "../../../../components/Elements";

export const TodoForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [, addTodo] = useAtom(addTodoAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    addTodo({
      title: title.trim(),
      description: "",
      status: "not-started",
      completed: false,
    });

    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいタスクを入力..."
          aria-label="新しいタスク"
          className="flex-1 mr-2"
        />
        <Button
          type="submit"
          disabled={!title.trim()}
          size="sm"
          className="whitespace-nowrap ml-2"
        >
          追加
        </Button>
      </div>
    </form>
  );
};
