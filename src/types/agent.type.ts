interface TopicAction {
  type: "SWITCH_TOPIC" | "STAY_ON_TOPIC";
  target_topic?: string;
  message?: string;
}

interface FollowupSuggestion {
  type: "FOLLOWUP_SUGGESTION";
  suggestions: string[];
}

export type UXAction = TopicAction | FollowupSuggestion | undefined;
