import { BaseMessage, BaseMessageChunk } from "@langchain/core/messages";
import { agentExecutor } from "../graph/agent-executor";
import { buildUXActions } from "../../utils/ux-actions";
import { ToolCall } from "@langchain/core/messages";
import { logger } from "../../utils/logging";

export const streamAgent = async function* (
  input: {
    input: string;
    topic: string;
    username: string;
    chat_history?: (BaseMessage | BaseMessageChunk)[];
    memory?: string[];
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
      const hasToolCalls = s.data?.chunk.tool_calls?.length > 0;
      const currentNode = s.metadata?.langgraph_node;

      // Skip streaming when tool calls and the current node is the agentNode to avoid sending incomplete information to the client. The complete information will be sent at the end of the chain execution.
      if (hasToolCalls && currentNode === "agentNode") continue;

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
