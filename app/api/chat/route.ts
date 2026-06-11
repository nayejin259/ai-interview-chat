import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt } from "@/lib/personas";

const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

export async function POST(req: Request) {
    const { messages, company, role, level } = await req.json();
    const systemPrompt = buildSystemPrompt(company, role, level);

    const contents = messages.map((m: { role: string, content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));

    let result;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            result = await client.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents,
                config: {
                    systemInstruction: systemPrompt,
                    thinkingConfig: { thinkingBudget: 0 },
                },
            });
            break;
        } catch (e: unknown) {
            const isRetryable = e instanceof Error && e.message.includes('503');
            if (!isRetryable || attempt === 2) {
                return new Response('잠시 후 다시 시도해 주세요. (서버 오류)', { status: 503 });
            }
            await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
        }
    }

    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of result!) {
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
