import { routerChain } from "../agents/chains/router.chain"
import { toolExecutor } from "../agents/utils/tool-executor"
import { AgentResponse } from "../types/agent.type"
import { logger } from "../utils/logging"


export const agentService = {
    new: async (prompt: string): Promise<AgentResponse> => {
        const chain = await routerChain.invoke({ input: prompt })

        const toolCall = await toolExecutor(chain)

        return {
            data: {
                ux_action: {
                    type: 'REDIRECT_TOPIC',
                    target_topic: toolCall?.suggested_topic,
                    message: toolCall?.handoff_message
                }
            }
        }
    }
}