const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testInteraction() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API KEY found");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Test the model directly first
    const modelName = "gemini-3-pro-preview"; // As requested
    console.log(`Testing model: ${modelName}`);

    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = "Analyze interaction between Warfarin and Aspirin. Return JSON: { hasInteraction: true, severity: 'high', description: 'test' }";

        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("Success:", response.text());
    } catch (error) {
        console.error(`Failed to use ${modelName}:`, error.message);

        // Fallback check
        console.log("Trying gemini-1.5-pro as fallback...");
        try {
            const fallback = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const res = await fallback.generateContent("Hello");
            console.log("Fallback 1.5-pro works:", res.response.text());
        } catch (e) {
            console.error("Fallback failed:", e.message);
        }
    }
}

testInteraction();
