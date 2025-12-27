
import { chains } from "../chains";
import { AgentExecutorState } from "./agent-executor";
import { ToolMessage } from "@langchain/core/messages";

export const agentNode = async (state: AgentExecutorState) => {
    const { topic, input, chat_history } = state;

    console.log(`--- AGENT NODE: ${topic} ---`);

    // 1. Select Chain based on topic
    // Default to 'general' if topic is invalid/missing
    const activeChain = chains[topic as keyof typeof chains] || chains['general'];

    // 2. Invoke Chain
    // The chains expect { input, chat_history }
    const response = await activeChain.invoke({
        input,
        chat_history: chat_history || []
    });

    // 3. Return update
    // If the chain returns a tool call (AIMessage with tool_calls)
    // we pass it in the state update.
    return {
        // We append the AIMessage to the history
        chat_history: [response],
        // If there's a tool_call, we might want to store it specifically 
        // but typically standard message history handles it.
        // For structured access in graph:
        tool_calls: response.tool_calls?.[0] ? {
            name: response.tool_calls[0].name,
            args: response.tool_calls[0].args,
            id: response.tool_calls[0].id
        } : undefined,
        result: response.content as string
    };
};

export const toolNode = async (state: AgentExecutorState) => {
    const { chat_history, tool_calls } = state;
    console.log(`--- TOOL NODE: ${tool_calls?.name} ---`);

    if (!tool_calls) return {};

    // For now, we only have topic_decision_tool logic potentially
    if (tool_calls.name === 'topic_decision_tool') {
        const result = tool_calls.args;

        // Return a ToolMessage to keep history consistent 
        // (though in this custom flow we might just care about side effects like switching topic)
        const toolMessage = new ToolMessage({
            tool_call_id: tool_calls.id!,
            content: JSON.stringify(result)
        });

        // Logic to switch topic if intent is clear
        let newTopic = state.topic;
        if (result.intent_level === 'clear' && result.suggested_topic) {
            newTopic = result.suggested_topic;
            console.log(`*** SWITCHING TOPIC TO: ${newTopic} ***`);
        }

        return {
            chat_history: [...chat_history, toolMessage],
            topic: newTopic, // Update the topic!
            tool_result: result
        };
    }

    return {};
};
