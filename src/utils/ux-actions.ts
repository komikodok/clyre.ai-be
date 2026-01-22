import { ToolCall } from "langchain";
import { UXAction } from "../types/agent.type";

export const buildUXActions = (tool_results: any, tool_calls: ToolCall[]) => {
  let ux_action: UXAction[] = [];

  Array.from({ length: tool_calls.length }, (_, index) => {
    switch (tool_calls[index].name) {
      case "switch_topic_tool":
        ux_action.push({
          type: "SWITCH_TOPIC",
          target_topic: tool_results?.[index].suggested_topic,
          message: tool_results?.[index].handoff_message,
        });
        break;
      case "initial_topic_tool":
        ux_action = [
          ...ux_action,
          {
            type: "SWITCH_TOPIC",
            target_topic: tool_results?.[index].topic,
          },
        ];
        break;

      case "followup_suggestion_tool":
        ux_action = [
          ...ux_action,
          {
            type: "FOLLOWUP_SUGGESTION",
            suggestions: tool_results?.[index].suggestions,
          },
        ];
        break;
      default:
        break;
    }
  });

  return ux_action;
};
