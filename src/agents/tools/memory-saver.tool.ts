import { tool } from "@langchain/core/tools";
import { z } from "zod";
import Memory from "../../models/memory.model";
import User from "../../models/user.model";
import { logger } from "../../utils/logging";

const memorySaverSchema = z.object({
  username: z
    .string()
    .describe("The username of the user whose session memory should be stored"),
  content: z.string().describe("The important information to save in memory"),
  handoff_message: z
    .string()
    .optional()
    .describe("Optional message related to the saved memory."),
});

export const memorySaverTool = tool(
  async (args: z.infer<typeof memorySaverSchema>) => {
    try {
      const user = await User.findOne({ username: args.username });

      const memory = await Memory.findOneAndUpdate(
        { user_id: user._id },
        {
          $push: {
            contents: {
              $each: [args.content],
              $slice: -7,
            },
          },
        },
        { upsert: true, new: true },
      );
      return { handoff_message: args.handoff_message || "Memory saved" };
    } catch (error) {
      logger.error("Failed to save memory", error);
      return { error: `Failed to save memory: ${error}` };
    }
  },
  {
    name: "memory_saver_tool",
    description: `
      Save important, long-term information that should be remembered across conversations within this session.
      Only use this tool for critical facts, preferences, or insights that will be valuable for future interactions.
      Do NOT use for temporary notes or routine responses.
    `,
    schema: memorySaverSchema,
  },
);
