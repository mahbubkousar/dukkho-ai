const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function verifyLite() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const apiKey = envContent.match(/GEMINI_API_KEY=(.*)/)[1].trim().replace(/"/g, '');

        const genAI = new GoogleGenerativeAI(apiKey);

        // Testing gemini-2.5-flash-lite WITH System Instruction
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            systemInstruction: "You are a helpful assistant. Reply with 'System Instruction Works'."
        });

        console.log("Testing System Instruction on gemini-2.5-flash-lite...");
        const result = await model.generateContent("Test.");
        console.log("Response:", result.response.text());

    } catch (error) {
        console.error("Verification Failed:", error.message);
        if (error.response) console.error("Details:", JSON.stringify(error.response, null, 2));
    }
}

verifyLite();
