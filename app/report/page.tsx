'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

interface Report {
    총점: string;
    총평: string;
    강점: string[];
    개선점: string[];
}

export default function ReportPage() {
    const [report, setReport] = useState<Report | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchReport = async () => {
        const messages = JSON.parse(localStorage.getItem('messages') || '[]')
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messages)
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error ?? '리포트 생성에 실패했어요.')
                return
            }
            setReport(data)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const load = async () => { await fetchReport() }
        load()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">

            {/* 그라디언트 헤더 */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 px-6 pt-10 pb-16 text-white">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-sm font-semibold tracking-widest uppercase opacity-80">Interview Report</span>
                        <Link href="/" className="text-sm opacity-70 hover:opacity-100 transition">← 홈으로</Link>
                    </div>
                    <p className="text-lg opacity-80 mb-1">종합 점수</p>
                    <p className="text-7xl font-bold tracking-tight">
                        {isLoading ? '—' : (report?.총점 ?? '—')}
                    </p>
                </div>
            </div>

            {/* 콘텐츠 */}
            <div className="max-w-2xl mx-auto px-4 -mt-6 pb-12">

                {isLoading && (
                    <div className="bg-white rounded-2xl shadow-sm px-6 py-10 flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-400">AI가 면접을 분석하고 있어요...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-white rounded-2xl shadow-sm px-6 py-8 flex flex-col items-center gap-4 text-center">
                        <p className="text-sm text-red-400">{error}</p>
                        <button onClick={fetchReport} className="text-sm text-blue-500 hover:text-blue-600">다시 시도</button>
                    </div>
                )}

                {report && (
                    <div className="flex flex-col gap-4">

                        {/* 종합 평가 */}
                        <div className="bg-white rounded-2xl shadow-sm px-6 py-5">
                            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">종합 평가</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{report.총평}</p>
                        </div>

                        {/* 강점 + 개선점 2열 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl shadow-sm px-5 py-5">
                                <p className="text-xs font-semibold text-green-500 uppercase tracking-widest mb-3">강점</p>
                                <ul className="flex flex-col gap-2">
                                    {report.강점.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm px-5 py-5">
                                <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-3">개선점</p>
                                <ul className="flex flex-col gap-2">
                                    {report.개선점.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* 다시 면접 */}
                        <Link href="/" className="mt-2 w-full text-center bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 text-sm font-semibold transition shadow-sm">
                            다시 면접 보기
                        </Link>

                    </div>
                )}
            </div>
        </div>
    )
}
