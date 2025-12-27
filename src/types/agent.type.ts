interface RedirectTopicAction {
    type: 'REDIRECT_TOPIC'
    target_topic?: string
    message?: string
}

interface ConfirmSwitchTopicAction {
    type: 'CONFIRM_SWITCH_TOPIC'
    target_topic?: string
    message?: string
}

type UXAction =
    RedirectTopicAction
    | ConfirmSwitchTopicAction

export interface AgentResponse {
    data: {
        ai_message?: string
        ux_action?: UXAction
    }
}