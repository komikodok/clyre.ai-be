import { StateGraph, END, START, Annotation } from '@langchain/langgraph'
import { BaseMessage } from '@langchain/core/messages'
import { agentNode, toolNode } from './nodes'

// Define the state using Annotation
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
    tool_calls: Annotation<{ name: string, args: Record<string, any>, id?: string } | undefined>({
        reducer: (x, y) => y ?? x,
        default: () => undefined
    }),
    tool_result: Annotation<Record<string, any> | undefined>({
        reducer: (x, y) => y ?? x,
        default: () => undefined
    })
});

// Export the type for use in nodes
export type AgentExecutorState = typeof AgentState.State;

// Conditional Edge Logic
const shouldContinue = (state: AgentExecutorState) => {
    if (state.tool_calls) {
        return "toolNode";
    }
    return END;
};

// Build the Graph
const workflow = new StateGraph(AgentState)
    .addNode("agentNode", agentNode)
    .addNode("toolNode", toolNode)
    .addEdge(START, "agentNode")
    .addConditionalEdges(
        "agentNode",
        shouldContinue,
        {
            toolNode: "toolNode",
            [END]: END
        }
    )
    .addEdge("toolNode", "agentNode");

export const agentExecutor = workflow.compile();