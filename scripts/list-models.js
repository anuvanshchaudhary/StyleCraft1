const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listAllModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API KEY found");
        return;
    }

    const cleanKey = apiKey.replace(/"/g, '').trim();
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("--- START MODEL LIST ---");
            data.models.forEach(m => {
                // Print just the name clearly
                console.log(m.name.replace('models/', ''));
            });
            console.log("--- END MODEL LIST ---");
        } else {
            console.error("API Error:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

listAllModels();
