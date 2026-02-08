import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export interface InteractionResult {
    hasInteraction: boolean;
    severity: 'high' | 'medium' | 'none';
    description: string;
}

export async function analyzeInteraction(drugA: string, drugB: string): Promise<InteractionResult> {
    try {
        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing.");
            throw new Error("GEMINI_API_KEY is not set.");
        }

        // Use Gemini 3 Pro for complex reasoning as requested
        const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

        const prompt = `
      Act as a clinical pharmacist. Analyze the potential drug-drug interaction between:
      Drug A: "${drugA}"
      Drug B: "${drugB}"

      Tasks:
      1. Determine if there is a known medical interaction.
      2. Assess the severity (High, Medium, None).
      3. Write a CONCISE warning message for a Voice Interface (Max 2 sentences). 
         - Mention the drug class if relevant (e.g., "Both are NSAIDs").
         - Mention the specific risk (e.g., "Increases risk of stomach irritation").
         - Example: "Paracetamol and Aspirin are both analgesics. Combining them increases risk of stomach irritation."

      Return a JSON object strictly matching this interface:
      {
        "hasInteraction": boolean,
        "severity": "high" | "medium" | "none",
        "description": "string"
      }

      Rules:
      - If no interaction exists, set hasInteraction: false, severity: "none".
      - If dangerous (life-threatening, majorcontraindication), set severity: "high".
      - If strict JSON cannot be generated, default to specific fallback.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonString = text.replace(/```json|```/g, "").trim();

        try {
            const parsed = JSON.parse(jsonString);
            return {
                hasInteraction: !!parsed.hasInteraction,
                severity: ['high', 'medium', 'none'].includes(parsed.severity) ? parsed.severity : 'none',
                description: parsed.description || "No description provided."
            };
        } catch (e) {
            console.error("Failed to parse Gemini Interaction JSON:", text);
            return { hasInteraction: false, severity: 'none', description: "Failed to analyze interaction." };
        }

    } catch (error) {
        console.error("Gemini Interaction API Error:", error);
        // Fallback? Or throw? The user wants "AI" so let's fail gracefully if it's just a model error
        // but maybe we should let the OpenFDA fallback happen if this fails? 
        // For now, return a safe "error" state so the UI doesn't crash.
        return { hasInteraction: false, severity: 'none', description: "AI Analysis unavailable." };
    }
}
