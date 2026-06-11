'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useChat } from '@/hooks/useChat'
import { useSpeech } from '@/hooks/useSpeech'
import { Mic } from 'lucide-react'
import { companies, roles, levels } from '@/lib/personas'

function ChatContent() {
    const searchParams = useSearchParams()
    const company = searchParams.get('company') ?? ''
    const role = searchParams.get('role') ?? ''
    const level = searchParams.get('level') ?? ''

    const { messages, input, setInput, isLoading, handleSend, sendMessage, ref } = useChat(company, role, level)
    const { handleMic, isRecording } = useSpeech(setInput, sendMessage)
    const router = useRouter()

    const companyName = companies.find(c => c.id === company)?.name ?? ''
    const roleName = roles.find(r => r.id === role)?.name ?? ''
    const levelName = levels.find(l => l.id === level)?.name ?? ''

    return (
        <div className="flex flex-col h-screen bg-gray-50">

            {/* 헤더 */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-3 flex items-center gap-3 text-white">
                <Link href="/" className="text-white opacity-70 hover:opacity-100 text-sm transition">← 뒤로</Link>
                <div className="flex-1">
                    <p className="font-semibold text-sm">{companyName} · {roleName}</p>
                    <p className="text-xs opacity-70">{levelName} 면접</p>
                </div>
                <button
                    onClick={() => {
                        localStorage.setItem('messages', JSON.stringify(messages))
                        router.push('/report')
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-full px-4 py-1.5 transition"
                >
                    면접 종료
                </button>
            </div>

            {/* 메시지 목록 */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                {messages.length === 0 && (
                    <p className="text-center text-gray-400 text-sm mt-10">면접관이 첫 질문을 준비하고 있어요</p>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${m.role === 'user'
                            ? 'bg-blue-500 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 rounded-bl-sm'
                            }`}>
                            {m.role === 'assistant' && m.content === '' ? (
                                <span className="flex gap-1 items-center py-1">
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0ms]" />
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]" />
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]" />
                                </span>
                            ) : (
                                <>
                                    <div>{m.content.split("[피드백]")[0]}</div>
                                    {m.content.includes("[피드백]") && (
                                        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400 leading-relaxed">
                                            [피드백]{m.content.split("[피드백]")[1]}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={ref} />
            </div>

            {/* 입력창 */}
            <div className="bg-white border-t border-gray-100 px-4 py-3 flex gap-2 items-center">
                <input
                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400 transition"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="답변을 입력하세요..."
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? '...' : '전송'}
                </button>
                <Mic
                    onClick={handleMic}
                    size={22}
                    color={isRecording ? '#3b82f6' : '#d1d5db'}
                    className="cursor-pointer transition"
                />
            </div>
        </div>
    )
}

export default function ChatPage() {
    return (
        <Suspense>
            <ChatContent />
        </Suspense>
    )
}
