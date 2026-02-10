import { createChain } from "../utils/chain-factory";

const systemPrompt = `You are a helpful assistant. Be concise and direct.`;

export const generalChain = createChain(systemPrompt, 0.1);
