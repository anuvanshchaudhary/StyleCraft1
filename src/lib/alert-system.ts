export function triggerAlert(message: string) {
    console.log(`[ALERT SYSTEM] Triggering alert: ${message}`);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        // Vibrate pattern: 200ms on, 100ms off, 200ms on
        const pattern = [200, 100, 200];
        const success = navigator.vibrate(pattern);
        console.log(`[ALERT SYSTEM] Navigator.vibrate returned: ${success}`);
        if (success) {
            console.log("Vibration pattern executed.");
        } else {
            console.warn("Vibration failed or not supported by device/context.");
        }
    } else {
        console.warn("[ALERT SYSTEM] Navigator.vibrate not supported in this environment.");
    }

    // Audio fallback mock
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance("Warning: Drug interaction detected.");
        window.speechSynthesis.speak(utterance);
    }
}
