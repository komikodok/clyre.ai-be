import { AIMessage, HumanMessage, HumanMessageChunk, ToolCall } from "langchain"
import { routerChain } from "../agents/chains/router.chain"
import { toolExecutor } from "../agents/utils/tool-executor"
import { AgentResponse } from "../types/agent.type"
import { logger } from "../utils/logging"
import { agentExecutor } from "../agents/graph/agent-executor"
import { buildUXActions } from "../utils/ux-actions"


export const agentService = {
    new: async (prompt: string): Promise<AgentResponse> => {
        const chain = await routerChain.invoke({ input: prompt })

        const toolResults = await toolExecutor(chain.tool_calls as ToolCall[])

        const UXAction = buildUXActions(toolResults[0], chain.tool_calls?.[0] as ToolCall)

        logger.info(UXAction)
        logger.info(chain.tool_calls)

        return {
            data: {
                ux_action: [UXAction]
            }
        }
    },
    consult: async (topic: string, data: { prompt: string }): Promise<AgentResponse> => {
        const agent = await agentExecutor.invoke({
            input: data.prompt,
            topic,
        })

        const UXActions = agent.tool_calls?.map((tool_call: ToolCall) => {
            return buildUXActions(agent.tool_result, tool_call)
        })

        logger.info(UXActions)
        logger.info(agent.tool_calls)

        return {
            data: {
                ai_message: agent?.result,
                ux_action: [...UXActions]
            }
        }
    }
}