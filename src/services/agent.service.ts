import { ToolCall } from "langchain";
import { routerChain } from "../agents/chains/router.chain";
import { toolExecutor } from "../agents/utils/tool-executor";
import { logger } from "../utils/logging";
import { buildUXActions } from "../utils/ux-actions";
import { streamAgent } from "../agents/utils/stream-agent";
import ChatMessageRepository from "../repositories/chat-message.repository";
import { agentExecutor } from "../agents/graph/agent-executor";

class AgentService {
  async new(prompt: string) {
    const chain = await routerChain.invoke({ input: prompt });

    const toolResults = await toolExecutor(chain.tool_calls as ToolCall[]);

    const UXAction = buildUXActions(
      toolResults,
      chain.tool_calls as ToolCall[]
    );

    logger.info(UXAction);
    logger.info(chain.tool_calls);

    return {
      data: {
        ux_action: UXAction,
      },
    };
  }

  async consult(
    params: { topic: string },
    data: { prompt: string; user_id: string }
  ) {
    const agent = await agentExecutor.invoke({
      input: data.prompt,
      topic: params.topic,
    });

    const UXActions = buildUXActions(
      agent.tool_result,
      agent.tool_calls as ToolCall[]
    );

    return {
      data: {
        ai_message: agent?.result,
        ux_actions: UXActions,
      },
    };
  }

  async *stream(
    params: { topic: string },
    data: { prompt: string; user_id: string }
  ) {
    const { chatHistory, sessionId } =
      await ChatMessageRepository.getChatHistory(params.topic, data.user_id);

    const agent = streamAgent({
      input: data.prompt,
      topic: params.topic,
      chat_history: chatHistory,
    });

    for await (const event of agent) {
      switch (event.type) {
        case "token":
          yield {
            type: "token",
            value: event.value,
          };
          break;
        case "__end__":
          const { data, ux_actions } = event.value;
          const toolCalls = data.tool_calls;
          const toolResult = data.tool_result;

          yield {
            type: "__end__",
            value: {
              ai_message: data.result,
              ux_actions,
            },
          };
          break;
        default:
          break;
      }
    }
  }
}

export const agentService = new AgentService();
