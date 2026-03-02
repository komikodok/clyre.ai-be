import { DynamicStructuredTool } from "@langchain/core/tools";
import { z, ZodTypeAny } from "zod";

export const followupSuggestionTool = new DynamicStructuredTool({
  name: "followup_suggestion_tool",
  description: `
    Generate 2–3 SHORT follow-up QUESTIONS
    that the USER is likely to ask next,
    based on the previous conversation.

    These are:
    - Questions written from the USER perspective
    - Natural, casual, spoken language
    - Expressing confusion, worry, or curiosity
    - NOT advice, NOT solutions, NOT statements

    These questions are ONLY for UI quick replies.
    The assistant must NOT say them in chat.
  `,
  schema: z.object({
    suggestions: z.array(
      z
        .string()
        .describe(
          "A short, natural follow-up QUESTION from the user perspective",
        ),
    ),
  }) as ZodTypeAny,
  func: async (args: { suggestions: string[] }) => args,
});
