import { NextRequest, NextResponse } from 'next/server';
import { analyzeInteraction } from '@/lib/gemini-interaction-service';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { drugA, drugB } = body;

        if (!drugA || !drugB) {
            return NextResponse.json({ error: 'Missing drug names' }, { status: 400 });
        }

        console.log(`[API] Checking interaction between ${drugA} and ${drugB} using Gemini 3...`);
        const result = await analyzeInteraction(drugA, drugB);

        console.log(`[API] Result:`, result);
        return NextResponse.json(result);

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
