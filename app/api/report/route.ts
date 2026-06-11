import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

export async function POST(req: Request) {
    const messages = await req.json();

    const contents = messages.map((m: { role: string, content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));

    contents.push({
        role: 'user',
        parts: [{ text: `이 면접 대화에서 지원자(user)의 답변만 평가해줘. 면접관 질문은 맥락 파악용으로만 참고해.
아래 JSON 형식으로만 응답해. 다른 텍스트는 절대 포함하지 마.
{
  "총점": "X/10",
  "총평": "2~3줄 종합 평가",
  "강점": ["강점1", "강점2", "강점3"],
  "개선점": ["개선점1", "개선점2", "개선점3"]
}` }],
    });

    let result;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            result = await client.models.generateContent({
                model: 'gemini-2.5-flash',
                contents,
                config: { responseMimeType: 'application/json' },
            });
            break;
        } catch (e: unknown) {
            const isRetryable = e instanceof Error && e.message.includes('503');
            if (!isRetryable || attempt === 2) throw e;
            await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
        }
    }

    return new Response(result!.text, {
        headers: { 'Content-Type': 'application/json' },
    });
}
