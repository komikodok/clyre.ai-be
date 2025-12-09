import { StateGraph, END, START } from '@langchain/langgraph'
import { BaseMessage } from 'langchain'

interface AgentExecutorState {
    input: string
    chat_history: string[] | BaseMessage[]
    result?: string
    toolCall?: {
        name: string
        args: Record<string, any>
    }
    toolResult?: Record<string, any>
};

const AgentExecutor = () => {
    const workflow = new StateGraph<AgentExecutorState>({
        channels: {
            input: null,
            chat_history: null,
            result: null,
            toolCall: null,
            toolResult: null
        }
    })
}