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


    const fetchPDF = async (file:File) => {
        setIsLoading(true)
        try {
            const formData = new FormData();
            formData.append('file',file)
            const res = await fetch('/api/parse-resume', {
                method: 'POST',
                body:formData
            })
            const data = await res.json();
            setResume(data)
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <>


            <input type="file" accept=".pdf" onChange={(e) => {
      const file = e.target.files?.[0]
      if (file) fetchPDF(file)
  }} />
            <form>
                <div>{resume?.이름}</div>
                <div>{resume?.기술스택}</div>
                <div>{JSON.stringify(resume?.경력)}</div>
                <div>{JSON.stringify(resume?.프로젝트)}</div>
                <div>{resume?.학력}</div>
            </form>
            <button onClick={() => {
                        localStorage.setItem('resume', JSON.stringify(resume))
                        router.push(`/chat?${params}`)
                    }}>완료</button>
        </>
    )
}

export default function ResumePage() {
    return (
        <Suspense>
            <ResumeContent />
        </Suspense>
    )
}