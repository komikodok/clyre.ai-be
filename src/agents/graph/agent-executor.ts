import { StateGraph, END, START, Annotation } from '@langchain/langgraph'
import { BaseMessage } from '@langchain/core/messages'
import { agentNode, toolNode, executeToolOrReturn } from './nodes'
import { ToolCall } from 'langchain';

export const AgentState = Annotation.Root({
    input: Annotation<string>,
    topic: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => "general"
    }),
    chat_history: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
        default: () => []
    }),
    result: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => ""
    }),
    tool_calls: Annotation<ToolCall[]>({
        reducer: (x, y) => y ?? x,
        default: () => []
    }),
    tool_result: Annotation<any[]>({
        reducer: (x, y) => y ?? x,
        default: () => []
    })
});

export type AgentExecutorState = typeof AgentState.State;

const workflow = new StateGraph(AgentState)
    .addNode("agentNode", agentNode)
    .addNode("toolNode", toolNode)
    .addEdge(START, "agentNode")
    .addConditionalEdges(
        "agentNode",
        executeToolOrReturn,
        {
            toolNode: "toolNode",
            [END]: END
        }
    )
    .addEdge("toolNode", END);

export const agentExecutor = workflow.compile();