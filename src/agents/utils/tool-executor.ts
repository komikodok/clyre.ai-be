import { ToolCall } from "@langchain/core/tools";
import { tools } from "../tools";
import { logger } from "../../utils/logging";
import { AgentExecutorState } from "../graph/agent-executor";

export const toolExecutor = async (
  toolCalls: ToolCall[],
  state?: AgentExecutorState,
) => {
  const results = await Promise.all(
    toolCalls.map((toolCall) => {
      const tool = tools[toolCall.name as keyof typeof tools];

      let args = toolCall.args as any;

      if (toolCall.name === "switch_topic_tool") {
        args.current_topic = state?.topic;
      }

      return tool.func(args);
    }),
  );

  return results;
};
