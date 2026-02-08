import { useCallback } from 'react';

export function useVoice() {
    const announce = useCallback((text: string, severity: 'high' | 'medium' | 'low' | 'none' = 'medium') => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Adjust pitch and rate based on severity
        if (severity === 'high') {
            utterance.pitch = 0.8; // Lower pitch for urgency
            utterance.rate = 1.1;  // Slightly faster
            utterance.volume = 1.0;
        } else if (severity === 'medium') {
            utterance.pitch = 1.0;
            utterance.rate = 1.0;
        } else {
            utterance.pitch = 1.1; // Higher pitch for normal/positive info
            utterance.rate = 1.0;
        }

        // Select a voice if available (optional, prefers Google US English or similar)
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.lang === 'en-US');
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        window.speechSynthesis.speak(utterance);
    }, []);

    return { announce };
}
