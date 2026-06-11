'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react"
import { Resume } from "@/lib/personas";

const careerLabels: Record<keyof Resume['career'][0], string> = {
    company: '회사',
    period: '기간',
    role: '역할',
}

const projectLabels: Record<keyof Resume['projects'][0], string> = {
    name: '이름',
    description: '설명',
    tech: '기술',
}

function ResumeContent() {
    const [isLoading, setIsLoading] = useState(false)
    const [resume, setResume] = useState<Resume | null>(null);
    const [isDragging, setIsDragging] = useState(false);
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

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file?.type === 'application/pdf') fetchPDF(file)
    }

    const updateField = <K extends keyof Resume>(key: K, value: Resume[K]) => {
        setResume(prev => prev ? { ...prev, [key]: value } : null)
    }

    const updateCareer = (i: number, field: keyof Resume['career'][0], value: string) => {
        setResume(prev => {
            if (!prev) return null
            const updated = [...prev.career]
            updated[i] = { ...updated[i], [field]: value }
            return { ...prev, career: updated }
        })
    }

    const updateProject = (i: number, field: keyof Resume['projects'][0], value: string) => {
        setResume(prev => {
            if (!prev) return null
            const updated = [...prev.projects]
            updated[i] = { ...updated[i], [field]: value }
            return { ...prev, projects: updated }
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
                <label
                    className={`bg-white rounded-2xl shadow-sm px-6 py-8 flex flex-col items-center gap-3 cursor-pointer hover:shadow-md transition border-2 border-dashed ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-400'}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    <span className="text-3xl">📄</span>
                    <p className="text-sm font-medium text-gray-700">PDF 파일 선택 또는 드래그</p>
                    <p className="text-xs text-gray-400">이력서 또는 포트폴리오 PDF</p>
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) fetchPDF(file)
                    }} />
                </label>

                {/* 건너뛰기 */}
                <button
                    onClick={() => router.push(`/chat?${params}`)}
                    className="text-sm text-gray-400 hover:text-gray-600 transition text-center"
                >
                    이력서 없이 시작하기 →
                </button>

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
                                value={resume.name}
                                onChange={(e) => updateField('name', e.target.value)}
                            />
                        </div>

                        {/* 학력 */}
                        <div className="bg-white rounded-2xl shadow-sm px-6 py-5">
                            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">학력</p>
                            <input
                                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400 transition"
                                value={resume.education}
                                onChange={(e) => updateField('education', e.target.value)}
                            />
                        </div>

                        {/* 기술스택 */}
                        <div className="bg-white rounded-2xl shadow-sm px-6 py-5">
                            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">기술스택</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {resume.skills.map((skill, i) => (
                                    <span key={i} className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                                        {skill}
                                        <button onClick={() => updateField('skills', resume.skills.filter((_, j) => j !== i))} className="text-blue-400 hover:text-blue-600">✕</button>
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
                                            updateField('skills', [...resume.skills, val]);
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
                                    onClick={() => updateField('career', [...resume.career, { company: '', period: '', role: '' }])}
                                    className="text-xs text-blue-500 hover:text-blue-600"
                                >+ 추가</button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {resume.career.map((c, i) => (
                                    <div key={i} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400">경력 {i + 1}</span>
                                            <button onClick={() => updateField('career', resume.career.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-500">삭제</button>
                                        </div>
                                        {(['company', 'period', 'role'] as const).map(field => (
                                            <input
                                                key={field}
                                                placeholder={careerLabels[field]}
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
                                    onClick={() => updateField('projects', [...resume.projects, { name: '', description: '', tech: '' }])}
                                    className="text-xs text-blue-500 hover:text-blue-600"
                                >+ 추가</button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {resume.projects.map((p, i) => (
                                    <div key={i} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400">프로젝트 {i + 1}</span>
                                            <button onClick={() => updateField('projects', resume.projects.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-500">삭제</button>
                                        </div>
                                        {(['name', 'description', 'tech'] as const).map(field => (
                                            <input
                                                key={field}
                                                placeholder={projectLabels[field]}
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
