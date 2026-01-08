import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const switchTopicTool = new DynamicStructuredTool({
  name: "switch_topic_tool",
  description: `
        Call this tool ONLY if the user's message
        shows STRONG and UNAMBIGUOUS intent
        to switch to a DIFFERENT consultation topic.

        If the user remains within the current topic,
        DO NOT call this tool.
    `,
  schema: z.object({
    suggested_topic: z.enum(["general", "anxiety", "insomnia", "burnout"]),

    handoff_message: z
      .string()
      .optional()
      .describe("Empathetic suggestion shown ONLY if intent_level is 'clear'"),
  }),

  func: async (args) => args,
});
