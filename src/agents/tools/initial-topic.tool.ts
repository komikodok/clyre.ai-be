import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const initialTopicTool = new DynamicStructuredTool({
    name: "initial_topic_tool",
    description: `
        Determine the most appropriate consultation topic
        for the user's FIRST message.
        This is NOT topic switching.
        This is initial classification.
    `,
    schema: z.object({
        topic: z.enum([
            "general",
            "anxiety",
            "insomnia",
            "burnout"
        ]),
        confidence: z.enum(["low", "medium", "high"])
    }),
    func: async (data) => data,
});
