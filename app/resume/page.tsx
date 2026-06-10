'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react"

interface Resume {
    이름: string;
    기술스택: string[];
    경력: { 회사: string; 기간: string; 역할: string }[];
    프로젝트: { 이름: string; 설명: string; 기술: string }[];
    학력: string;
}

function ResumeContent() {
    const [isLoading, setIsLoading] = useState(false)
    const [resume, setResume] = useState<Resume | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = searchParams.toString();

    const fetchPDF = async (file: File) => {
        setIsLoading(true)
        try {
            const formData = new FormData();
            formData.append('file', file)
            const res = await fetch('/api/parse-resume', { method: 'POST', body: formData })
            const data = await res.json();
            setResume(data)
        } finally {
            setIsLoading(false)
        }
    }

    const updateField = <K extends keyof Resume>(key: K, value: Resume[K]) => {
        setResume(prev => prev ? { ...prev, [key]: value } : null)
    }

    const updateCareer = (i: number, field: keyof Resume['경력'][0], value: string) => {
        setResume(prev => {
            if (!prev) return null
            const updated = [...prev.경력]
            updated[i] = { ...updated[i], [field]: value }
            return { ...prev, 경력: updated }
        })
    }

    const updateProject = (i: number, field: keyof Resume['프로젝트'][0], value: string) => {
        setResume(prev => {
            if (!prev) return null
            const updated = [...prev.프로젝트]
            updated[i] = { ...updated[i], [field]: value }
            return { ...prev, 프로젝트: updated }
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* 헤더 */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 px-6 pt-14 pb-20 text-white text-center">
                <p className="text-xs font-semibold tracking-widest uppercase opacity-70 mb-3">AI Interview</p>
                <h1 className="text-3xl font-bold mb-2">이력서 입력</h1>
                <p className="text-sm opacity-75">PDF를 업로드하면 자동으로 정보를 추출해요</p>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-8 pb-12 flex flex-col gap-4">

                {/* PDF 업로드 */}
                <label className="bg-white rounded-2xl shadow-sm px-6 py-8 flex flex-col items-center gap-3 cursor-pointer hover:shadow-md transition border-2 border-dashed border-gray-200 hover:border-blue-400">
                    <span className="text-3xl">📄</span>
                    <p className="text-sm font-medium text-gray-700">PDF 파일 선택</p>
                    <p className="text-xs text-gray-400">이력서 또는 포트폴리오 PDF</p>
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) fetchPDF(file)
                    }} />
                </label>

                {/* 로딩 */}
                {isLoading && (
                    <div className="bg-white rounded-2xl shadow-sm px-6 py-10 flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-400">이력서를 분석하고 있어요...</p>
                    </div>
                )}

                {/* 폼 */}
                {resume && (
                    <>
                        {/* 이름 */}
                        <div className="bg-white rounded-2xl shadow-sm px-6 py-5">
                            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">이름</p>
                            <input
                                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400 transition"
                                value={resume.이름}
                                onChange={(e) => updateField('이름', e.target.value)}
                            />
                        </div>

                        {/* 학력 */}
                        <div className="bg-white rounded-2xl shadow-sm px-6 py-5">
                            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">학력</p>
                            <input
                                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400 transition"
                                value={resume.학력}
                                onChange={(e) => updateField('학력', e.target.value)}
                            />
                        </div>

                        {/* 기술스택 */}
                        <div className="bg-white rounded-2xl shadow-sm px-6 py-5">
                            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">기술스택</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {resume.기술스택.map((skill, i) => (
                                    <span key={i} className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                                        {skill}
                                        <button onClick={() => updateField('기술스택', resume.기술스택.filter((_, j) => j !== i))} className="text-blue-400 hover:text-blue-600">✕</button>
                                    </span>
                                ))}
                            </div>
                            <input
                                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400 transition"
                                placeholder="기술 입력 후 Enter"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const val = (e.target as HTMLInputElement).value.trim()
                                        if (val) {
                                            updateField('기술스택', [...resume.기술스택, val]);
                                            (e.target as HTMLInputElement).value = ''
                                        }
                                    }
                                }}
                            />
                        </div>

                        {/* 경력 */}
                        <div className="bg-white rounded-2xl shadow-sm px-6 py-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">경력</p>
                                <button
                                    onClick={() => updateField('경력', [...resume.경력, { 회사: '', 기간: '', 역할: '' }])}
                                    className="text-xs text-blue-500 hover:text-blue-600"
                                >+ 추가</button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {resume.경력.map((c, i) => (
                                    <div key={i} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400">경력 {i + 1}</span>
                                            <button onClick={() => updateField('경력', resume.경력.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-500">삭제</button>
                                        </div>
                                        {(['회사', '기간', '역할'] as const).map(field => (
                                            <input
                                                key={field}
                                                placeholder={field}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400 transition"
                                                value={c[field]}
                                                onChange={(e) => updateCareer(i, field, e.target.value)}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 프로젝트 */}
                        <div className="bg-white rounded-2xl shadow-sm px-6 py-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">프로젝트</p>
                                <button
                                    onClick={() => updateField('프로젝트', [...resume.프로젝트, { 이름: '', 설명: '', 기술: '' }])}
                                    className="text-xs text-blue-500 hover:text-blue-600"
                                >+ 추가</button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {resume.프로젝트.map((p, i) => (
                                    <div key={i} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400">프로젝트 {i + 1}</span>
                                            <button onClick={() => updateField('프로젝트', resume.프로젝트.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-500">삭제</button>
                                        </div>
                                        {(['이름', '설명', '기술'] as const).map(field => (
                                            <input
                                                key={field}
                                                placeholder={field}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400 transition"
                                                value={p[field]}
                                                onChange={(e) => updateProject(i, field, e.target.value)}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 완료 버튼 */}
                        <button
                            onClick={() => {
                                localStorage.setItem('resume', JSON.stringify(resume))
                                router.push(`/chat?${params}`)
                            }}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 text-sm font-semibold transition shadow-sm"
                        >
                            면접 시작하기
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default function ResumePage() {
    return (
        <Suspense>
            <ResumeContent />
        </Suspense>
    )
}
