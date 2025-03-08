import { z } from "zod";

export const statusOptions: { [key in Status]: string } = {
  "not-started": "未対応",
  "in-progress": "処理中",
  completed: "処理済み",
  pending: "保留",
  done: "完了",
};

const StatusSchema = z.enum([
  "not-started",
  "in-progress",
  "completed",
  "pending",
  "done",
]);
export type Status = z.infer<typeof StatusSchema>;

const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: StatusSchema,
  deleted: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Todo = z.infer<typeof TodoSchema>;

export const TodoCreateInputSchema = TodoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type TodoCreateInput = z.infer<typeof TodoCreateInputSchema>;

export const TodoUpdateInputSchema = TodoSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).partial();
export type TodoUpdateInput = z.infer<typeof TodoUpdateInputSchema>;
