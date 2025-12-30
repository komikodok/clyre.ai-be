import { ToolCall } from "langchain"
import { UXAction } from "../types/agent.type"

export const buildUXActions = (tool_result: any, tool_calls: ToolCall) => {
    let ux_action: UXAction

    switch (tool_calls?.name) {
        case 'topic_decision_tool':
            if (tool_result.drift_detected) {
                ux_action = {
                    type: 'SWITCH_TOPIC',
                    target_topic: tool_result.suggested_topic,
                    message: tool_result.handoff_message
                }
            } else {
                ux_action = { type: 'STAY_ON_TOPIC' }
            }

            break
        case 'initial_topic_tool':
            ux_action = {
                type: 'SWITCH_TOPIC',
                target_topic: tool_result.topic,
            }
            break
        default:
            break
    }

    return ux_action
}