export const topics = ["general", "anxiety", "insomnia", "burnout"] as const;

export type Topic = (typeof topics)[number];

interface TopicAction {
  type: "SWITCH_TOPIC";
  target_topic?: Topic;
  message?: string;
}

interface FollowupSuggestion {
  type: "FOLLOWUP_SUGGESTION";
  suggestions: string[];
}

interface MemoryUpdateAction {
  type: "MEMORY_UPDATE";
  message?: string;
}

export type UXAction =
  | TopicAction
  | FollowupSuggestion
  | MemoryUpdateAction
  | undefined;
