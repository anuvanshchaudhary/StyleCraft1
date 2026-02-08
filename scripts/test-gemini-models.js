require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    try {
        // Try listing models first if possible, but API key might restrict list permission
        // So let's try a generate content on a few known models
        const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"];

        for (const modelName of models) {
            console.log(`Testing ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`✅ ${modelName} SUCCESS`);
            } catch (e) {
                console.log(`❌ ${modelName} FAILED: ${e.message.split('\n')[0]}`);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

test();
