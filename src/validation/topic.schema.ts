import { z } from "zod";

export const topicSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
});
