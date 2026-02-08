import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/gemini-service';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { image } = body;

        if (!image) {
            return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
        }

        console.log("[OCR API] Processing image with Gemini...");
        const result = await analyzeImage(image);
        console.log("[OCR API] Result:", result);

        return NextResponse.json({
            success: true,
            drugName: result.drugName,
            genericName: result.genericName,
            confidence: result.confidence,
            isMedicine: result.isMedicine
        });

    } catch (error: any) {
        console.error("OCR Route Error:", error);

        // CRITICAL UPDATE: NO SIMULATION FALLBACK.
        // If the API fails, we return a hard error so the user knows it failed.
        return NextResponse.json({
            success: false,
            error: "Failed to process image. Please check your API usage or network."
        }, { status: 500 });
    }
}
