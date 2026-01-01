interface TopicAction {
    type: 'SWITCH_TOPIC' | 'STAY_ON_TOPIC'
    target_topic?: string
    message?: string
}

interface FollowupQuestion {
    type: 'FOLLOWUP_QUESTION'
    question: string[]
}

export type UXAction = TopicAction | FollowupQuestion | undefined

export interface AgentResponse {
    data: {
        ai_message?: string
        ux_action?: UXAction[]
    }
}