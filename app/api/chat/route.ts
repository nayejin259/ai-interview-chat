import { GoogleGenerativeAI } from "@google/generative-ai";
  import { personas } from "@/lib/personas";

  const client = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

  export async function POST(req: Request) {
      const { messages, personaId } = await req.json();
      const foundPersona = personas.find((p) => p.id === personaId);

      const model = client.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction: foundPersona!.systemPrompt,
          generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as object,
      });

      const history = messages.slice(0, -1).map((m: {role:string, content:string}) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
      }));

      const lastMessage = messages[messages.length - 1];
      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(lastMessage.content);

      const readableStream = new ReadableStream({
          async start(controller) {
              for await (const chunk of result.stream) {
                  const text = chunk.text();
                  if (text) {
                      controller.enqueue(new TextEncoder().encode(text));
                  }
              }
              controller.close();
          }
      });

      return new Response(readableStream);
  }