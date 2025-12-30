
import { END } from "@langchain/langgraph";
import { chains } from "../chains";
import { AgentExecutorState } from "./agent-executor";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { toolExecutor } from "../utils/tool-executor";
import { logger } from "../../utils/logging";

export const agentNode = async (state: AgentExecutorState) => {
    const { topic, input, chat_history } = state;

    const activeChain = chains[topic as keyof typeof chains] || chains['general'];

    const human_msg = new HumanMessage({ content: input })
    const ai_msg = await activeChain.invoke({
        input,
        chat_history: chat_history
    });

    return {
        result: ai_msg.content,
        chat_history: [human_msg, ai_msg],
        tool_calls: ai_msg.tool_calls,
    };
};

export const executeToolOrReturn = (state: AgentExecutorState) => {
    const { tool_calls } = state

    if (tool_calls?.length > 0) {
        return "toolNode"
    }

    return END
}

export const toolNode = async (state: AgentExecutorState) => {
    let newTopic: string | undefined

    const { tool_calls } = state

    const toolMessages = tool_calls.map((tool) => {
        if (tool.name === 'topic_decision_tool') {
            newTopic = tool.args.suggested_topic
        }

        const toolMsg = new ToolMessage({
            tool_call_id: tool.id,
            content: JSON.stringify(tool)
        })

        return toolMsg
    })

    const executeTools = await toolExecutor(tool_calls)

    return {
        chat_history: [...toolMessages],
        tool_result: executeTools,
        topic: newTopic
    }
};
