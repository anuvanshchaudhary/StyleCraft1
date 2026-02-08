"use client";
import React, { useRef, useEffect, useState } from 'react';

interface MedicineCameraProps {
    onCapture: (imageSrc: string) => void;
}

export default function MedicineCamera({ onCapture }: MedicineCameraProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function setupCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Could not access the camera. Please ensure permissions are granted.");
            }
        }

        setupCamera();

        // Cleanup function to stop tracks when component unmounts
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const captureFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageSrc = canvas.toDataURL('image/jpeg');
                onCapture(imageSrc);
            }
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center">
            {error && <div className="text-red-500 bg-red-100 p-2 rounded mb-2">{error}</div>}

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-md rounded-lg shadow-lg border-2 border-slate-700 bg-slate-900"
            />

            <canvas ref={canvasRef} className="hidden" />

            <button
                onClick={captureFrame}
                className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg transition-transform active:scale-95"
            >
                Scan Medicine
            </button>
        </div>
    );
}
