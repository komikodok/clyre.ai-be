import { ToolCall } from "langchain"
import { UXAction } from "../types/agent.type"

export const buildUXActions = (tool_result: any, tool_calls: ToolCall) => {
    let ux_action: UXAction

    switch (tool_calls?.name) {
        case 'topic_decision_tool':
            if (
                tool_result.drift_detected &&
                tool_result.current_topic !== tool_result.suggested_topic
            ) {
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

        case 'followup_question_tool':
            ux_action = {
                type: 'FOLLOWUP_QUESTION',
                question: tool_result.question,
            }
            break
        default:
            ux_action = undefined
            break
    }

    return ux_action
}