import React, { useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { addTodoAtom } from "../../stores";
import { Input, Textarea } from "../../../../components/Form";
import { Button } from "../../../../components/Elements";
import { authState } from "../../../../features/users/stores/userAtoms";

export const TodoAdd: React.FC = () => {
  const { user } = useAtomValue(authState);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [, addTodo] = useAtom(addTodoAtom);

  const handleAddTodo = () => {
    if (!title.trim()) return;

    addTodo({
      title: title.trim(),
      description: description.trim(),
      status: "not-started",
      deleted: false,
      userId: user?.id || "",
    });

    setTitle("");
    setDescription("");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Todo追加</h2>
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいタスクを入力..."
          aria-label="新しいタスク"
          className="mt-1"
        />
      </div>
      <div className="mb-4">
        <Textarea
          label="詳細"
          id="description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          placeholder="タスクの詳細を入力..."
          aria-label="タスクの詳細"
          rows={3}
        />
      </div>
      <Button onClick={handleAddTodo} disabled={!title.trim()}>
        登録
      </Button>
    </div>
  );
};
