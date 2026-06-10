import { useEffect, useRef, useState } from "react"

export function useChat(company: string, role: string, level: string) {
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const ref = useRef<HTMLDivElement>(null);

    const fetchAIResponse = async (messageHistory: { role: string, content: string }[]) => {
        setIsLoading(true)
        setMessages(prev => [...prev, { role: 'assistant', content: '' }])

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messageHistory, company, role, level })
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
        } finally {
            setIsLoading(false)
        }
    }

    const sendMessage = (text: string) => {
        if (isLoading || !text.trim()) return
        const newMessages = [...messages, { role: 'user', content: text }]
        setMessages(newMessages)
        setInput('')
        fetchAIResponse([
            { role: 'user', content: '면접을 시작해주세요' },
            ...newMessages,
        ])
    }

    const handleSend = () => sendMessage(input)

    useEffect(() => {
        const triggerMessage = async () =>
            fetchAIResponse([{ role: 'user', content: '면접을 시작해주세요' }])
        triggerMessage()
    }, [])

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return { messages, input, setInput, isLoading, handleSend, sendMessage, ref }
}
