# AI 모의면접 챗봇

기업·직군·연차를 선택하고 이력서를 업로드하면 맞춤형 AI 면접관과 실전 모의면접을 진행할 수 있는 웹 서비스입니다.

🔗 **배포 링크**: https://ai-interview-chat-two.vercel.app

---

## 주요 기능

- **맞춤 면접관 생성** — 기업(카카오·네이버·토스 등 7개) × 직군(프론트엔드·백엔드 등 6개) × 연차(신입·주니어·시니어) 조합으로 동적 페르소나 생성
- **PDF 이력서 파싱** — PDF 업로드(드래그앤드롭 지원) → Gemini 멀티모달로 자동 추출 → 수정 폼 → 면접에 반영
- **실시간 스트리밍** — Gemini API 스트리밍으로 면접관 답변을 타이핑되듯 출력
- **음성 인식** — Web Speech API로 마이크 입력 → 자동 전송
- **답변 피드백** — 매 답변마다 [피드백]·[점수] 실시간 제공
- **종합 리포트** — 면접 종료 시 총점·총평·강점·개선점 AI 분석 리포트 생성
- **이력서 없이 시작** — 이력서 없이도 바로 면접 진행 가능

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js (App Router) + TypeScript |
| 스타일 | Tailwind CSS |
| AI | Google Gemini API (`@google/genai` v2.8.0, `gemini-2.5-flash`) |
| 음성 | Web Speech API (`webkitSpeechRecognition`) |
| 배포 | Vercel |

---

## 프로젝트 구조

```
app/
├── page.tsx              # 기업·직군·연차 선택 화면
├── resume/page.tsx       # PDF 업로드 및 이력서 수정
├── chat/page.tsx         # 면접 채팅 화면
├── report/page.tsx       # 종합 리포트
└── api/
    ├── chat/route.ts     # Gemini 스트리밍 API
    ├── report/route.ts   # 면접 평가 API
    └── parse-resume/route.ts  # PDF 파싱 API

hooks/
├── useChat.ts            # 채팅 상태 및 AI 통신 로직
└── useSpeech.ts          # 음성 인식 로직

lib/
└── personas.ts           # 기업·직군·연차 데이터 + 시스템 프롬프트 생성
```

---

## 로컬 실행

```bash
# 패키지 설치
npm install

# 환경변수 설정
# .env.local 파일 생성 후 아래 값 입력
GOOGLE_AI_API_KEY=your_gemini_api_key

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인

---

## 개발 과정

[`devlog/`](./devlog) 폴더에 날짜별 학습 기록을 남기고 있습니다.
