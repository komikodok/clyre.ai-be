import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const topicDecisionTool = new DynamicStructuredTool({
    name: "topic_decision_tool",
    description: `
    Analyze the user's message relative to the CURRENT topic.
    Detect whether the message shows:
    - clear intent for another consultation topic
    - or only casual / contextual mentions

    Do NOT diagnose.
    Do NOT force topic switching.
  `,
    schema: z.object({
        suggested_topic: z.enum([
            "general",
            "anxiety",
            "insomnia",
            "burnout",
        ]),

        intent_level: z.enum([
            "none",        // cuma nyebut, konteks ringan
            "weak",        // indikasi halus
            "clear"        // jelas ingin bahas topik lain
        ]),

        drift_detected: z.boolean(),

        handoff_message: z
            .string()
            .optional()
            .describe(
                "Empathetic suggestion shown ONLY if intent_level is 'clear'"
            ),
    }),

    func: async (data) => data,
});

