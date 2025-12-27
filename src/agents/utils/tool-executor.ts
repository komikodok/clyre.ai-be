import { AIMessage } from "langchain"
import { tools } from "../tools"

export const toolExecutor = async (aiMessage: AIMessage) => {
    const toolCalls = aiMessage.tool_calls?.find(tc => tc.name in tools)

    if (!toolCalls) return

    const executeTool = tools[toolCalls.name as keyof typeof tools]

    return await executeTool.func(toolCalls.args as any)
}   