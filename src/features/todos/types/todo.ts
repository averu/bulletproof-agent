import { z } from "zod";

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
  completed: z.boolean(),
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
  createdAt: true,
  updatedAt: true,
}).partial();
export type TodoUpdateInput = z.infer<typeof TodoUpdateInputSchema>;
