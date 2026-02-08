import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API client.
// Requires GEMINI_API_KEY in environment variables.
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function analyzeImage(base64Image: string): Promise<{ drugName: string, genericName: string, confidence: number, isMedicine: boolean }> {
    try {
        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing.");
            throw new Error("GEMINI_API_KEY is not set.");
        }

        // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

        // Convert base64 to GenerativePart
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
            },
        };

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
      Analyze this image strictly for medical identification.
      
      Tasks:
      1. Is there a medicine packaging, pill bottle, or blister strip visible? (Handwritten labels are acceptable if clearly legitimate).
      2. If YES, extract the BRAND NAME (e.g., 'Dolo-650').
      3. CRITICAL: Identify the PRIMARY GENERIC SALT NAME for this medication, especially for Indian brands (e.g., Dolo -> Paracetamol, Crocin -> Paracetamol).
      4. If NO (e.g., face, hand, blurry object with no text), set "isMedicine" to false.

      SAFETY RULES:
      - If a human face is visible BUT a medicine label/text is clearly held up in front, IGNORE the face and extract the text.
      - If ONLY a face is visible with no medicine, return "Unknown".
      - NEVER guess if the text is unreadable.

      Return a JSON object: 
      { 
        "drugName": "string (Brand Name)",
        "genericName": "string (Generic Salt Name)",
        "confidence": number (0-100),
        "isMedicine": boolean
      }
      
      - Set "drugName": "Unknown" if "isMedicine" is false.
      - If brand and generic are same, repeat it in both fields.
    `;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code blocks (```json ... ```)
        const jsonString = text.replace(/```json|```/g, "").trim();

        try {
            const parsed = JSON.parse(jsonString);
            return {
                drugName: parsed.drugName || "Unknown",
                genericName: parsed.genericName || parsed.drugName || "Unknown",
                confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
                isMedicine: typeof parsed.isMedicine === 'boolean' ? parsed.isMedicine : true
            };
        } catch (e) {
            console.error("Failed to parse Gemini JSON:", text);
            return { drugName: "Unknown", genericName: "Unknown", confidence: 0, isMedicine: false };
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to process image with Gemini.");
    }
}
