import { ToolCall } from "langchain";
import { UXAction } from "../types/agent.type";

export const buildUXActions = (tool_results: any, tool_calls: ToolCall[]) => {
  let ux_action: UXAction[] = [];

  Array.from({ length: tool_calls.length }, (_, index) => {
    switch (tool_calls[index].name) {
      case "switch_topic_tool":
        const currentTopic = tool_results?.[index].current_topic;
        const targetTopic = tool_results?.[index].target_topic;
        const handoffMessage = tool_results?.[index].handoff_message;

        if (currentTopic === targetTopic) break;

        ux_action.push({
          type: "SWITCH_TOPIC",
          target_topic: targetTopic,
          message: handoffMessage,
        });
        break;
      case "initial_topic_tool":
        ux_action.push({
          type: "SWITCH_TOPIC",
          target_topic: tool_results?.[index].topic,
        });
        break;
      case "followup_suggestion_tool":
        ux_action.push({
          type: "FOLLOWUP_SUGGESTION",
          suggestions: tool_results?.[index].suggestions,
        });
        break;
      default:
        break;
    }
  });
  return ux_action;
};
