const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listAllModels() {
    const apiKey = process.env.GEMINI_API_KEY.replace(/"/g, '').trim();
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.models) {
        data.models.forEach(m => console.log(m.name.replace('models/', '')));
    }
}
listAllModels();
