import { BaseMessage, BaseMessageChunk } from "langchain";
import { agentExecutor } from "../graph/agent-executor";
import { buildUXActions } from "../../utils/ux-actions";
import { ToolCall } from "langchain";
import { logger } from "../../utils/logging";

export const streamAgent = async function* (input: {
  input: string;
  topic: string;
  chat_history?: BaseMessage[] | BaseMessageChunk[];
}) {
  const stream = agentExecutor.streamEvents(input, { version: "v2" });

  for await (const s of stream) {
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
        result.tool_calls as ToolCall[]
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
