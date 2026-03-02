import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { topics, Topic } from "../../types/agent.type";

const switchTopicSchema = z.object({
  current_topic: z.enum(topics),
  target_topic: z.enum(topics),
  handoff_message: z
    .string()
    .optional()
    .describe("Empathetic suggestion shown ONLY if intent_level is 'clear'"),
});

export const switchTopicTool = tool(
  (args: z.infer<typeof switchTopicSchema>) => args,
  {
    name: "switch_topic_tool",
    description: `
        Call this tool ONLY if the user's message
        shows STRONG and UNAMBIGUOUS intent
        to switch to a DIFFERENT consultation topic.

        If the user remains within the current topic,
        DO NOT call this tool.
    `,
    schema: switchTopicSchema,
  },
);
