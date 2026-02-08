import { NextRequest, NextResponse } from "next/server";
import { analyzeUserResponse } from "@/lib/gemini-interaction-service";

export async function POST(req: NextRequest) {
    try {
        const { userResponse, questionContext } = await req.json();

        if (!userResponse || !questionContext) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const advice = await analyzeUserResponse(userResponse, questionContext);

        return NextResponse.json({ advice });
    } catch (e: any) {
        console.error("API Error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
