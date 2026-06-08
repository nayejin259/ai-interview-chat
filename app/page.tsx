import { personas } from "@/lib/personas";
  import Link from "next/link";

  export default function Home() {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 모의면접</h1>
        <p className="text-gray-500 mb-10">면접관을 선택해 연습을 시작하세요</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {personas.map((persona) => (
            <Link key={persona.id} href={`/chat/${persona.id}`}>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">{persona.name}</h2>
                <p className="text-sm text-gray-500">{persona.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    );
  }