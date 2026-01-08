import { AIMessage, HumanMessage, ToolCall } from "langchain";
import { routerChain } from "../agents/chains/router.chain";
import { toolExecutor } from "../agents/utils/tool-executor";
import { logger } from "../utils/logging";
import { agentExecutor } from "../agents/graph/agent-executor";
import { buildUXActions } from "../utils/ux-actions";

export const agentService = {
  new: async (prompt: string) => {
    const chain = await routerChain.invoke({ input: prompt });

    const toolResults = await toolExecutor(chain.tool_calls as ToolCall[]);

    const UXAction = buildUXActions(
      toolResults[0],
      chain.tool_calls?.[0] as ToolCall
    );

    logger.info(UXAction);
    logger.info(chain.tool_calls);

    return {
      data: {
        ux_action: [UXAction],
      },
    };
  },
  consult: async (topic: string, data: { prompt: string }) => {
    const agent = await agentExecutor.invoke({
      input: data.prompt,
      topic,
    });

    const UXActions = Array.from(
      { length: agent.tool_calls.length },
      (_, index) => {
        return buildUXActions(
          agent.tool_result?.[index],
          agent.tool_calls?.[index] as ToolCall
        );
      }
    );

    logger.info(agent.tool_calls);

    return {
      data: {
        ai_message: agent?.result,
        ux_action: [...UXActions],
      },
    };
  },
};
