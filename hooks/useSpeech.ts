// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
declare var webkitSpeechRecognition: any;

import { useState } from "react";



export function useSpeech(setInput: (text: string) => void) {
    const [isRecording, setIsRecording] = useState(false);
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ko-KR'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript
        setInput(text)
    }

    // 녹음 시작/중단 토글
    const handleMic = () => {
        if (isRecording) {
            recognition.stop()
            setIsRecording(false)
        } else {
            recognition.start()
            setIsRecording(true)
        }

    }

    return { handleMic, isRecording }

}