import { DynamicStructuredTool } from "langchain";
import { z, ZodTypeAny } from "zod";
import Memory from "../../models/memory.model";
import User from "../../models/user.model";

export const memorySaverTool = new DynamicStructuredTool({
  name: "memory_saver_tool",
  description: `
    Save important, long-term information that should be remembered across conversations within this session.
    Only use this tool for critical facts, preferences, or insights that will be valuable for future interactions.
    Do NOT use for temporary notes or routine responses.
  `,
  schema: z.object({
    username: z
      .string()
      .describe(
        "The username of the user whose session memory should be stored",
      ),
    content: z.string().describe("The important information to save in memory"),
  }) as ZodTypeAny,
  func: async (args: { username: string; content: string }) => {
    try {
      const user = await User.findOne({ username: args.username });

      const memory = await Memory.findOneAndUpdate(
        { user_id: user._id },
        {
          $push: {
            memory: {
              $each: [args.content],
              $slice: -7,
            },
          },
        },
        { upsert: true, new: true },
      );
      return `Memory saved: ${args.content}`;
    } catch (error) {
      return `Failed to save memory: ${error}`;
    }
  },
});
