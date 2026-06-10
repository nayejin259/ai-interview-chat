'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { companies, roles, levels } from '@/lib/personas'

export default function Home() {
    const [selectedCompany, setSelectedCompany] = useState('')
    const [selectedRole, setSelectedRole] = useState('')
    const [selectedLevel, setSelectedLevel] = useState('')
    const router = useRouter()

    const canStart = selectedCompany && selectedRole && selectedLevel

    const handleStart = () => {
        const params = new URLSearchParams({ company: selectedCompany, role: selectedRole, level: selectedLevel })
        router.push(`/chat?${params}`)
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* 그라디언트 헤더 */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 px-6 pt-14 pb-20 text-white text-center">
                <p className="text-xs font-semibold tracking-widest uppercase opacity-70 mb-3">AI Interview</p>
                <h1 className="text-4xl font-bold mb-2">AI 모의면접</h1>
                <p className="text-base opacity-75">기업과 직군을 선택해 맞춤 면접을 시작하세요</p>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-8 pb-12 flex flex-col gap-4">

                {/* 기업 선택 */}
                <div className="bg-white rounded-2xl shadow-sm px-6 py-5">
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">기업</p>
                    <div className="flex flex-wrap gap-2">
                        {companies.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedCompany(c.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCompany === c.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                    {selectedCompany && (
                        <p className="text-xs text-gray-400 mt-2">{companies.find(c => c.id === selectedCompany)?.description}</p>
                    )}
                </div>

                {/* 직군 선택 */}
                <div className="bg-white rounded-2xl shadow-sm px-6 py-5">
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">직군</p>
                    <div className="flex flex-wrap gap-2">
                        {roles.map(r => (
                            <button
                                key={r.id}
                                onClick={() => setSelectedRole(r.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedRole === r.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {r.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 연차 선택 */}
                <div className="bg-white rounded-2xl shadow-sm px-6 py-5">
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">연차</p>
                    <div className="flex flex-wrap gap-2">
                        {levels.map(l => (
                            <button
                                key={l.id}
                                onClick={() => setSelectedLevel(l.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedLevel === l.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {l.name}
                                <span className="text-xs opacity-60 ml-1">({l.description})</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 시작 버튼 */}
                <button
                    onClick={handleStart}
                    disabled={!canStart}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full py-3 text-sm font-semibold transition shadow-sm"
                >
                    {canStart ? '면접 시작하기' : '기업 · 직군 · 연차를 선택하세요'}
                </button>

            </div>
        </div>
    )
}
