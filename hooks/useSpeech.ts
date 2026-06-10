// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
declare var webkitSpeechRecognition: any;

import { useRef, useState } from "react";

export function useSpeech(setInput: (text: string) => void, sendMessage: (text: string) => void) {
    const [isRecording, setIsRecording] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    const handleMic = () => {
        if (isRecording) {
            recognitionRef.current?.stop()
            setIsRecording(false)
            return
        }

        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'ko-KR'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript
            setInput(text)
            sendMessage(text)
            setIsRecording(false)
        }
        recognition.onerror = () => setIsRecording(false)
        recognitionRef.current = recognition
        recognition.start()
        setIsRecording(true)
    }

    return { handleMic, isRecording }
}
