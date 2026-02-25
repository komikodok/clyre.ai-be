import { tool } from "@langchain/core/tools";
import { z } from "zod";

const followupSuggestionSchema = z.object({
  suggestions: z.array(
    z
      .string()
      .describe(
        "A short, natural follow-up QUESTION from the user perspective",
      ),
  ),
});

export const followupSuggestionTool = tool(
  (args: z.infer<typeof followupSuggestionSchema>) => args,
  {
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
    schema: followupSuggestionSchema,
  },
);
