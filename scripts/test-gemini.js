const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API KEY found in .env.local");
        return; // Exit if no key
    }

    // Clean up key (remove quotes if present)
    const cleanKey = apiKey.replace(/"/g, '').trim();

    // Try to list models (this is not directly exposed in the high-level client easily, 
    // but let's try a direct test with gemini-pro first which is usually available)

    const genAI = new GoogleGenerativeAI(cleanKey);

    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-001",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    console.log(`Checking models with key: ${cleanKey.substring(0, 5)}...`);

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            // Simple prompt
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`✅ SUCCESS: ${modelName}`);
            return; // Found a working one!
        } catch (error) {
            console.log(`❌ FAILED: ${modelName} - ${error.message.split('\n')[0]}`);
        }
    }

    console.log("No working models found.");
}

checkModels();
