import { GoogleGenAI } from "@google/genai";
import { personas } from "@/lib/personas";

const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

export async function POST(req: Request) {
    const { messages, personaId } = await req.json();
    const foundPersona = personas.find((p) => p.id === personaId);

    const contents = messages.map((m: { role: string, content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));

    const result = await client.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents,
        config: {
            systemInstruction: foundPersona!.systemPrompt,
            thinkingConfig: { thinkingBudget: 0 },
        },
    });

    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of result) {
                const text = chunk.text;
                if (text) {
                    controller.enqueue(new TextEncoder().encode(text));
                }
            }
            controller.close();
        }
    });

    return new Response(readableStream);
}
