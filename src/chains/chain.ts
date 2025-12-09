import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { RunnableSequence, RunnableLambda } from "@langchain/core/runnables"
import { ChatGroq } from "@langchain/groq"
import { tool } from "langchain"
import dotenv from "dotenv"
import z from "zod"

dotenv.config()

const GROQ_API_KEY = process.env.GROQ_API_KEY

const weatherTools = tool(
    ({ temperature, city }: { temperature: number, city: string }) => {
        return `Cuaca di kota ${city} adalah ${temperature} Derajat`
    },
    {
        name: 'weather_tools',
        description: 'Useful when the response is related weather',
        schema: z.object({
            temperature: z.number(),
            city: z.string()
        })
    }
)

const prompt = `Kamu adalah asisten UI/UX expert yang berbahasa Indonesia.

KAMU PUNYA TOOL KHUSUS:
- weather_tools: Gunakan INI untuk semua permintaan terkait cuaca.`

const promptTemplate = ChatPromptTemplate.fromMessages([
    ['system', prompt],
    new MessagesPlaceholder({ 
        variableName: 'chat_history',
        optional: true
    }),
    ['human', '{input}']
]);

const models = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: GROQ_API_KEY,
}).bindTools([weatherTools]);

(async () => {
    const chain = await RunnableSequence.from([
        promptTemplate,
        models
    ])

    const result = await chain.invoke({input: 'cuaca di kota Pekalongan?', chat_history: []})

    const toolExecutor = {
        weather_tools: weatherTools
    }

    const toolCalls = result.tool_calls?.find(toolCall => toolCall.name in toolExecutor)

    if (!toolCalls) {
        console.log(result.content)
        return
    }
    
    console.log(await toolExecutor[toolCalls.name as keyof typeof toolExecutor].func({...toolCalls.args}))
    console.log(toolCalls)
})()