import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { topics } from "../../types/agent.type";

export const initialTopicTool = tool(
  (args: { topic: (typeof topics)[number] }) => args,
  {
    name: "initial_topic_tool",
    description: `
        Determine the most appropriate consultation topic
        for the user's FIRST message.
        This is NOT topic switching.
        This is initial classification.
    `,
    schema: z.object({
      topic: z.enum(topics),
    }),
  },
);
