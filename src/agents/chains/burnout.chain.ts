import { createChain } from "../utils/chain-factory";

const systemPrompt = `
    Focus on exhaustion, detachment, reduced effectiveness from chronic stress.
    Frame burnout as a stress response, not personal failure.
    Suggest sustainable recovery strategies, not productivity hacks.
    Escalate if hopelessness or self-harm appears.
    Tone: validating, grounded.
`;

export const burnoutChain = createChain(systemPrompt);
