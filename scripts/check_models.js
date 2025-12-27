const fs = require('fs');
const path = require('path');

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

async function testGeneration() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error(".env.local file not found.");
            return;
        }
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);

        if (!match || !match[1]) {
            console.error("Could not find GEMINI_API_KEY");
            return;
        }

        let apiKey = match[1].trim();
        if (apiKey.startsWith('"') && apiKey.endsWith('"')) {
            apiKey = apiKey.slice(1, -1);
        }

        console.log("Using API Key:", apiKey.substring(0, 4) + "..." + apiKey.slice(-4));

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash", // Testing 1.5-flash
            systemInstruction: "You are Dukkho AI...",
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ],
        });

        console.log("Starting chat generation test...");
        const result = await model.generateContent("আমার জীবনটা শেষ হয়ে গেল।");
        const response = result.response;
        console.log("Response received:");
        console.log(response.text());

    } catch (error) {
        console.error("Test Error:", error);
        if (error.response) {
            console.error("Detailed API Error:", JSON.stringify(error.response, null, 2));
        }
    }
}

testGeneration();


