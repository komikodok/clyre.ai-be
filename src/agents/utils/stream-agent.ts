import { BaseMessage, BaseMessageChunk } from "langchain";
import { agentExecutor } from "../graph/agent-executor";
import { buildUXActions } from "../../utils/ux-actions";
import { ToolCall } from "langchain";

export const streamAgent = async function* (
  input: {
    input: string;
    topic: "general" | "anxiety" | "insomnia" | "burnout";
    username: string;
    chat_history?: (BaseMessage | BaseMessageChunk)[];
  },
  signal?: AbortSignal,
) {
  const stream = agentExecutor.streamEvents(input, { version: "v2", signal });

  for await (const s of stream) {
    if (signal?.aborted) {
      break;
    }
    if (s.event === "on_chat_model_stream") {
      const content = s.data?.chunk.content; // stream token <string>

      if (content) {
        yield {
          type: "token",
          value: content,
        };
      }
    }

    if (s.event === "on_chain_end" && s.name === "LangGraph") {
      const result = s.data?.output; // output data <AgentExecutorState>

      const UXActions = buildUXActions(
        result.tool_result,
        result.tool_calls as ToolCall[],
      );

      yield {
        type: "__end__",
        value: {
          data: result,
          ux_actions: UXActions,
        },
      };
    }
  }
};
