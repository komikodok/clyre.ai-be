import { DynamicStructuredTool } from "langchain";
import { z } from "zod";


export const followupQuestionTool = new DynamicStructuredTool({
    name: "followup_question_tool",
    description: `
    Suggest 2-3 natural follow-up questions ONLY if it would significantly help the user.
    If no follow-up is needed, DO NOT call this tool at all.
  `,
    schema: z.object({
        question: z.array(
            z.string().describe(
                "A natural follow-up question based on the conversation context"
            )
        )
    }),
    func: async (args) => args
});
