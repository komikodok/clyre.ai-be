import { topicDecisionTool } from "./topic-decision.tool"
import { initialTopicTool } from "./initial-topic.tool"
import { followupQuestionTool } from "./followup_question_tool"

export const tools = {
    topic_decision_tool: topicDecisionTool,
    initial_topic_tool: initialTopicTool,
    followup_question_tool: followupQuestionTool
}