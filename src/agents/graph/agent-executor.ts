import { StateGraph, END, START, Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import {
  agentNode,
  executeToolNode,
  finalToolNode,
  executeToolOrReturn,
  retrieveDocsNode,
} from "./nodes";
import { ToolCall } from "langchain";

export const AgentState = Annotation.Root({
  input: Annotation<string>,
  topic: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "general",
  }),
  username: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "Anonymous",
  }),
  chat_history: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  result: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  tool_calls: Annotation<ToolCall[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  tool_result: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  retrieved_context: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
});

export type AgentExecutorState = typeof AgentState.State;

const workflow = new StateGraph(AgentState)
  .addNode("retrieveDocsNode", retrieveDocsNode)
  .addNode("agentNode", agentNode)
  .addNode("executeToolNode", executeToolNode)
  .addNode("finalToolNode", finalToolNode)

  .addEdge(START, "retrieveDocsNode")
  .addEdge("retrieveDocsNode", "agentNode")
  .addConditionalEdges("agentNode", executeToolOrReturn, {
    executeToolNode: "executeToolNode",
    [END]: END,
  })
  .addEdge("executeToolNode", "finalToolNode")
  .addEdge("finalToolNode", END);

export const agentExecutor = workflow.compile();
