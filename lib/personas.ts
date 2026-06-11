export interface Resume {
    name: string;
    skills: string[];
    career: { company: string; period: string; role: string }[];
    projects: { name: string; description: string; tech: string }[];
    education: string;
}


export const companies = [
    { id: 'kakao', name: '카카오', description: '수평적 문화, 기술 중심' },
    { id: 'naver', name: '네이버', description: '대규모 서비스 경험' },
    { id: 'line', name: '라인', description: '글로벌 서비스' },
    { id: 'coupang', name: '쿠팡', description: '빠른 실행, 데이터 기반' },
    { id: 'toss', name: '토스', description: 'UX 중심, 빠른 개발' },
    { id: 'samsung', name: '삼성전자', description: '안정적 대기업 문화' },
    { id: 'startup', name: '스타트업', description: '열정, 제너럴리스트' },
]

export const roles = [
    { id: 'frontend', name: '프론트엔드' },
    { id: 'backend', name: '백엔드' },
    { id: 'fullstack', name: '풀스택' },
    { id: 'mobile', name: 'iOS/Android' },
    { id: 'pm', name: '기획(PM)' },
    { id: 'data', name: '데이터분석' },
]

export const levels = [
    { id: 'new', name: '신입', description: '경력 없음' },
    { id: 'junior', name: '주니어', description: '1~3년' },
    { id: 'senior', name: '시니어', description: '3년 이상' },
]




const companyTraits: Record<string, string> = {
    kakao: '수평적이고 기술 중심적인 카카오 문화에 맞게 코드 품질과 기술적 깊이를 중시해. 편하게 반말로 대화해.',
    naver: '네이버답게 대규모 트래픽 처리 경험과 서비스 이해도를 중시해. 전문적이고 체계적으로 진행해.',
    line: '글로벌 서비스를 운영하는 라인답게 다양한 환경 적응력과 커뮤니케이션 능력을 봐. 영어 질문을 가끔 섞어.',
    coupang: '쿠팡답게 빠른 실행력과 데이터 기반 사고를 중시해. 직접적이고 실용적인 스타일로 진행해.',
    toss: '토스답게 사용자 임팩트와 왜 그 선택을 했는지 깊게 파고들어. 편하게 반말로 대화해.',
    samsung: '삼성전자답게 격식 있고 체계적으로 진행해. 기술 역량과 함께 조직 적합성과 인성도 봐.',
    startup: '스타트업답게 열정과 제너럴리스트 성향을 중시해. 불확실한 환경에서 주도적으로 일할 수 있는지 봐.',
}

const roleTraits: Record<string, string> = {
    frontend: 'React, TypeScript, 브라우저 렌더링, 성능 최적화, CSS, 웹 접근성 등 프론트엔드 기술을 집중적으로 물어봐.',
    backend: '서버 아키텍처, 데이터베이스 설계, API 설계, 동시성 처리, 보안 등 백엔드 역량을 물어봐.',
    fullstack: '프론트엔드와 백엔드 전반을 커버하되 시스템 전체를 보는 시각을 물어봐.',
    mobile: '각 플랫폼 특성(iOS/Android), 앱 성능 최적화, 네이티브 API 활용을 물어봐.',
    pm: '서비스 기획력, 데이터 기반 의사결정, 개발팀과의 협업, 우선순위 설정 능력을 물어봐.',
    data: 'SQL, Python, 통계적 사고, 비즈니스 인사이트 도출 능력을 물어봐.',
}

const levelTraits: Record<string, string> = {
    new: '신입이므로 기초 개념, 학습 태도, 성장 가능성, 문제 해결 방식을 중점적으로 봐. 너무 어렵게 하지 마.',
    junior: '1~3년차로서 실무 경험을 바탕으로 한 문제 해결 능력과 협업 경험을 물어봐.',
    senior: '3년 이상 시니어로서 기술적 의사결정, 시스템 설계, 기술 리더십을 물어봐.',
}

export function buildSystemPrompt(companyId: string, roleId: string, levelId: string, resume?: Resume | null): string {
    const company = companies.find(c => c.id === companyId)
    const role = roles.find(r => r.id === roleId)
    const level = levels.find(l => l.id === levelId)

    const resumeSection = resume ? `
지원자 이력서:
- 이름: ${resume.name}
- 학력: ${resume.education}
- 기술스택: ${resume.skills.join(', ')}
- 경력: ${resume.career.map(c => `${c.company} (${c.period}) - ${c.role}`).join(' / ')}
- 프로젝트: ${resume.projects.map(p => `${p.name}: ${p.description} [${p.tech}]`).join(' / ')}

이 이력서를 바탕으로 지원자의 실제 경험과 기술에 맞는 질문을 해줘.` : ''

    return `너는 ${company?.name} ${role?.name} 포지션 면접관이야. ${level?.name} 지원자를 면접하고 있어.

${companyTraits[companyId] ?? ''}
${roleTraits[roleId] ?? ''}
${levelTraits[levelId] ?? ''}
${resumeSection}
질문은 하나씩 해. 답변이 부족하면 꼬리 질문으로 깊게 파고들어. 처음엔 간단한 자기소개로 시작해.
[피드백]과 [점수]는 반드시 지원자가 답변한 경우에만 붙여. 면접관인 네가 먼저 말을 꺼내는 경우(첫 인사, 질문 등)에는 절대 붙이지 마.
지원자 답변 후 응답 형식: 면접 반응/다음 질문 먼저, 그 다음 줄에 아래 형식으로만.
[피드백]: (1~2줄로 핵심만)
[점수]: X/10`
}
