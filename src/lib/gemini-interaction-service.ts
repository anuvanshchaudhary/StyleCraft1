import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export interface InteractionResult {
    hasInteraction: boolean;
    severity: "high" | "medium" | "none";
    description: string;
    proactiveQuestion?: string;
}

export async function analyzeInteraction(
    drugA: string,
    drugB: string
): Promise<InteractionResult> {
    if (!apiKey) {
        console.error("GEMINI_API_KEY is missing.");
        return {
            hasInteraction: false,
            severity: "none",
            description: "API Key Missing",
        };
    }

    // Use Gemini 1.5 Flash for speed & reliability in Voice Demo
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        // Ensure JSON mode
        generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
    Act as a clinical pharmacist. Analyze the potential drug-drug interaction between:
    Drug A: "${drugA}"
    Drug B: "${drugB}"

    Tasks:
    1. Determine if there is a known medical interaction.
    2. Assess the severity (High, Medium, None).
    3. Write a CONCISE warning message for a Voice Interface (Max 2 sentences). 
       - Mention specific risk (e.g., "Increases bleeding risk").
    4. **PROACTIVE QUESTION:** If interaction is Medium/High, generate a 1-sentence, empathetic follow-up question based on side effects.
       - Example: "Have you noticed any unusual bruising today?"
       - If None, leave empty or null.

    Return a JSON object:
    {
      "hasInteraction": boolean,
      "severity": "high" | "medium" | "none",
      "description": "string",
      "proactiveQuestion": "string"
    }

    Rules:
    - If no interaction, set hasInteraction: false, severity: "none".
    - If dangerous, set severity: "high".
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const data = JSON.parse(text);

        return {
            hasInteraction: !!data.hasInteraction,
            severity: ["high", "medium", "none"].includes(data.severity)
                ? data.severity
                : "none",
            description: data.description || "No description provided.",
            proactiveQuestion: data.proactiveQuestion || "",
        };
    } catch (error) {
        console.error("Gemini Interaction Error:", error);
        return {
            hasInteraction: false,
            severity: "none",
            description: "AI Analysis unavailable.",
        };
    }
}

export async function analyzeUserResponse(
    userResponse: string,
    questionContext: string
): Promise<string> {
    if (!apiKey) return "API Key Missing";

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
        Context: The AI asked the patient: "${questionContext}"
        Patient Replied: "${userResponse}"

        Task:
        1. Analyze the sentiment (Is the user reporting a symptom? Yes/No).
        2. Generate a compassionate, short response (Max 2 sentences).
           - If YES (symptom reported): Advise seeing a doctor or visiting a clinic immediately.
           - If NO (no symptom): Reassure them to keep monitoring.
        
        Return just the plain text response string.
    `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (e) {
        console.error("Response Analysis Error", e);
        return "I couldn't understand that, but please consult your doctor if you feel unwell.";
    }
}
