import { z } from "zod";

export const statusOptions: { [key in Status]: string } = {
  "not-started": "未対応",
  "in-progress": "処理中",
  completed: "処理済み",
  pending: "保留",
  done: "完了",
};

// 優先度の定義
export const priorityOptions: { [key in Priority]: string } = {
  high: "高",
  medium: "中",
  low: "低",
};

const PrioritySchema = z.enum(["high", "medium", "low"]);
export type Priority = z.infer<typeof PrioritySchema>;

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
  name: z.string(),
  assigneeId: z.string().optional(),
  priority: PrioritySchema.default("medium"), // 優先度を追加 (デフォルト: 中)
  dueDate: z.date().nullable(), // 期日を追加 (任意)
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
}).extend({
  assigneeId: z.string().optional(),
  priority: PrioritySchema.optional(), // 更新時も optional
  dueDate: z.date().nullable().optional(), // 更新時も optional
}).partial();
export type TodoUpdateInput = z.infer<typeof TodoUpdateInputSchema>;
