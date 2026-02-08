"use client";
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

interface MedicineScannerProps {
    onCapture: (imageSrc: string) => void;
}

const videoConstraints = {
    facingMode: { exact: "environment" }
};

export default function MedicineScanner({ onCapture }: MedicineScannerProps) {
    const webcamRef = useRef<Webcam>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
    const [isCameraReady, setIsCameraReady] = useState(false);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                onCapture(imageSrc);
            }
        }
    }, [webcamRef, onCapture]);

    const toggleCamera = () => {
        setFacingMode(prev => (prev === "user" ? "environment" : "user"));
    };

    return (
        <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }}
                onUserMedia={() => setIsCameraReady(true)}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {!isCameraReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/80 z-20">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-semibold text-lg">Starting Camera...</p>
                </div>
            )}

            {/* Scanner Overlay Guide */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="w-[80%] h-[50%] border-2 border-white/30 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 -mt-0.5 -ml-0.5 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 -mt-0.5 -mr-0.5 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 -mb-0.5 -ml-0.5 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 -mb-0.5 -mr-0.5 rounded-br-lg"></div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6 z-20 px-4">
                <button
                    onClick={toggleCamera}
                    className="p-4 bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:bg-slate-700 text-white rounded-full shadow-lg active:scale-95 transition-all"
                    aria-label="Switch Camera"
                >
                    <span className="text-xl">🔄</span>
                </button>

                <button
                    onClick={capture}
                    className="flex-1 max-w-[200px] py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl rounded-2xl shadow-xl shadow-emerald-900/50 active:scale-95 transition-all flex items-center justify-center gap-2 ring-4 ring-emerald-500/30"
                    aria-label="Scan Medicine Label"
                >
                    <span className="text-2xl">📸</span>
                    <span>SCAN</span>
                </button>
            </div>
        </div>
    );
}
