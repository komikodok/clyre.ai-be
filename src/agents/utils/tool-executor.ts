import { ToolCall } from "langchain"
import { tools } from "../tools"
import { logger } from "../../utils/logging"


export const toolExecutor = async (tool_calls: ToolCall[]) => {
    const results = await Promise.all(
        tool_calls.map(toolCall => {
            const tool = tools[toolCall.name as keyof typeof tools]

            if (!tool) {
                logger.warn(`Tool not found: ${toolCall.name}`)
                return null
            }

            return tool.func(toolCall.args as any)
        })
    )

    return results
}
