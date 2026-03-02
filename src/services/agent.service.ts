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

    const UXActionsde = buildUXActions(
      toolResults,
      chain.tool_calls as ToolCall[],
    );

    return {
      data: {
        ux_actions: UXActionsde,
      },
    };
  }

  async consult(
    params: { topic: string },
    data: { prompt: string; user_id: string; username?: string },
  ) {
    const { chatHistory, sessionMessageId } =
      await ChatMessageRepository.getChatHistory(params.topic, data.user_id);

    const agent = await agentExecutor.invoke({
      input: data.prompt,
      topic: params.topic,
      username: data.username,
      chat_history: chatHistory,
    });

    const UXActions = buildUXActions(
      agent.tool_result,
      agent.tool_calls as ToolCall[],
    );

    // await ChatMessageRepository.saveMessages(sessionMessageId, [
    //   { role: "user", content: data.input },
    //   {
    //     role: "assistant",
    //     content: agent.result,
    //     tool_calls: agent.tool_calls,
    //   },
    // ]);

    return {
      data: {
        ai_message: agent?.result,
        ux_actions: UXActions,
      },
    };
  }
  async *stream(
    params: { topic: string },
    data: { prompt: string; user_id: string; username?: string },
    signal?: AbortSignal,
  ) {
    const { chatHistory, sessionMessageId } =
      await ChatMessageRepository.getChatHistory(params.topic, data.user_id);

    const agent = streamAgent(
      {
        input: data.prompt,
        topic: params.topic,
        username: data.username,
        chat_history: chatHistory,
      },
      signal,
    );

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
          // await ChatMessageRepository.saveMessages(sessionMessageId, [
          //   { role: "user", content: data.input || "" },
          //   {
          //     role: "assistant",
          //     content: data.result,
          //     tool_calls: data.tool_calls,
          //   },
          // ]);

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
