import { initialTopicTool } from "../tools/initial-topic.tool";
import { createChain } from "../utils/chain-factory";

const routerPrompt = `
    You are a routing classifier.
    Your task is ONLY to select the correct topic.
    DO NOT answer the user.
    DO NOT explain.
    DO NOT provide any natural language text.

    You MUST call the tool with the correct arguments.
`;

export const routerChain = createChain(routerPrompt, 0.2, [initialTopicTool]);
