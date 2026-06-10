import { personas } from "@/lib/personas";
import Link from "next/link";

const personaEmoji: Record<string, string> = {
  'startup-cto': '💻',
  'corp-hr': '🏢',
  'global-hr': '🌐',
  'startup-ceo': '🚀',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* 그라디언트 헤더 */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-400 px-6 pt-14 pb-20 text-white text-center">
        <p className="text-xs font-semibold tracking-widest uppercase opacity-70 mb-3">AI Interview</p>
        <h1 className="text-4xl font-bold mb-2">AI 모의면접</h1>
        <p className="text-base opacity-75">면접관을 선택해 연습을 시작하세요</p>
      </div>

      {/* 카드 목록 */}
      <div className="max-w-2xl mx-auto px-4 -mt-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {personas.map((persona) => (
            <Link key={persona.id} href={`/chat/${persona.id}`}>
              <div className="bg-white rounded-2xl shadow-sm px-6 py-5 hover:shadow-md transition cursor-pointer group">
                <span className="text-3xl mb-3 block">{personaEmoji[persona.id]}</span>
                <h2 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-500 transition">{persona.name}</h2>
                <p className="text-sm text-gray-400">{persona.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
