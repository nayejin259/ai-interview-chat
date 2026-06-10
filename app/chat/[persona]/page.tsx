'use client'

import { use } from "react"
import { personas } from "@/lib/personas"
import Link from "next/link"
import { useChat } from "@/hooks/useChat"
import { useSpeech } from "@/hooks/useSpeech"
import {Mic} from 'lucide-react'


export default function ChatPage({ params }: { params: Promise<{ persona: string }> }) {
    const { persona } = use(params)
    const { messages, input, setInput, isLoading, handleSend, sendMessage, ref } = useChat(persona)
    const {handleMic, isRecording} = useSpeech(setInput, sendMessage)
    const foundPersona = personas.find(p => p.id === persona)


    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* 헤더 */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">← 뒤로</Link>
                <div>
                    <p className="font-semibold text-gray-900">{foundPersona?.name}</p>
                    <p className="text-xs text-gray-400">{foundPersona?.description}</p>
                </div>
            </div>

            {/* 메시지 목록 */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                {messages.length === 0 && (
                    <p className="text-center text-gray-400 text-sm mt-10">면접관이 첫 질문을 기다리고 있어요</p>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${m.role === 'user'
                                ? 'bg-blue-500 text-white rounded-br-sm'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                            }`}>
                            <div>{m.content.split("[피드백]")[0]}</div>
                            <div>[피드백]{m.content.split("[피드백]")[1]}</div>
                        </div>
                    </div>
                ))}
                <div ref={ref}></div>
            </div>


            {/* 입력창 */}
            <div className="bg-white border-t border-gray-200 px-4 py-3 flex gap-2">
                <input
                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
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
                <Mic onClick={handleMic} color={isRecording ? '#ff0000' : '#a6aaaf'} />
            </div>
        </div>
    )
}