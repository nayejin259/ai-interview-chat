import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

export async function POST(req:Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File

    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64')

    const contents = [{
      role: 'user',
      parts: [
          { inlineData: { mimeType: 'application/pdf', data: base64String } },
          { text: `이 이력서에서 아래 JSON 형식으로 정보를 추출해줘. 없는 정보는 빈 값으로 남겨.
  {
    "이름": "",
    "기술스택": [],
    "경력": [{"회사": "", "기간": "", "역할": ""}],
    "프로젝트": [{"이름": "", "설명": "", "기술": ""}],
    "학력": ""
  }` }
      ]
  }]

  const result = await client.models.generateContent({
    model:'gemini-2.5-flash',
    contents,
    config:{responseMimeType: 'application/json'}
  })

   return new Response(result.text, {
      headers: { 'Content-Type': 'application/json' }
  })
}