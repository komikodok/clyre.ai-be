interface TopicAction {
    type: 'SWITCH_TOPIC' | 'STAY_ON_TOPIC'
    target_topic?: string
    message?: string
}

export type UXAction = TopicAction | undefined
// | ConfirmSwitchTopicAction

export interface AgentResponse {
    data: {
        ai_message?: string
        ux_action?: UXAction[]
    }
}