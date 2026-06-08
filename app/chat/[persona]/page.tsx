'use client'

  import { useState, use } from "react"
  import { personas } from "@/lib/personas"

  export default function ChatPage({ params }: { params: Promise<{ persona: string }> }) {
      const { persona } = use(params)
      const foundPersona = personas.find(p => p.id === persona)
      const [messages, setMessages] = useState<{ role: string, content: string }[]>([])
      const [input, setInput] = useState('')

      const handleSend = async () => {
          const newMessage = [...messages, { role: 'user' as const, content: input }]
          setMessages(newMessage)
          setInput('')

          setMessages(prev => [...prev, { role: 'assistant' as const, content: '' }])

          const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messages: newMessage, personaId: persona })
          })

          const reader = res.body!.getReader()
          const decoder = new TextDecoder()

          while (true) {
              const { done, value } = await reader.read()
              if (done) break
              const text = decoder.decode(value)
              setMessages(prev => {
                  const last = prev[prev.length - 1]
                  return [...prev.slice(0, -1), { ...last, content: last.content + text }]
              })
          }
      }

      return (
          <div className="flex flex-col h-screen bg-gray-50">
              {/* 헤더 */}
              <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                  <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">← 뒤로</a>
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
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                              m.role === 'user'
                                  ? 'bg-blue-500 text-white rounded-br-sm'
                                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                          }`}>
                              {m.content}
                          </div>
                      </div>
                  ))}
              </div>

              {/* 입력창 */}
              <div className="bg-white border-t border-gray-200 px-4 py-3 flex gap-2">
                  <input
                      className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="답변을 입력하세요..."
                  />
                  <button
                      onClick={handleSend}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium transition"
                  >
                      전송
                  </button>
              </div>
          </div>
      )
  }