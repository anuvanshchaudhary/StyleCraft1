import { useCallback } from 'react';

export function useVoice() {
    const announce = useCallback((text: string, severity: 'high' | 'medium' | 'low' | 'none' = 'medium', onEnd?: () => void) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        // Adjust pitch/rate
        if (severity === 'high') {
            utterance.pitch = 0.9;
            utterance.rate = 1.1;
        } else if (severity === 'medium') {
            utterance.pitch = 1.0;
            utterance.rate = 1.0;
        } else {
            utterance.pitch = 1.1;
            utterance.rate = 1.0;
        }

        // Voice selection
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'));
        if (preferredVoice) utterance.voice = preferredVoice;

        if (onEnd) {
            utterance.onend = onEnd;
        }

        window.speechSynthesis.speak(utterance);
    }, []);

    return { announce };
}
