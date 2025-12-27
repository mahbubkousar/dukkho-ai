const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function findWorkingModel() {
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

        // 1. List Models
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const listResponse = await fetch(url);
        const data = await listResponse.json();

        if (!data.models) {
            console.error("Failed to list models:", data);
            return;
        }

        const candidateModels = data.models
            .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace('models/', ''));

        console.log(`Found ${candidateModels.length} candidate models. Testing each...`);

        const genAI = new GoogleGenerativeAI(apiKey);

        for (const modelName of candidateModels) {
            console.log(`\nTesting: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello.");
                const response = result.response;
                const text = response.text();

                if (text) {
                    console.log(`✅ SUCCESS! Model '${modelName}' works.`);
                    console.log(`Response: ${text.substring(0, 50)}...`);
                    // We found a winner, but let's test a few more to see options, 
                    // or just stop here if we want the first working one.
                    // For now, let's keep going to see full availability.
                }
            } catch (error) {
                let status = "Unknown Error";
                if (error.response) status = error.response.status;
                else if (error.message && error.message.includes("429")) status = "429 Quota Exceeded";
                else if (error.message && error.message.includes("404")) status = "404 Not Found";

                console.log(`❌ FAILED: ${modelName} - ${status}`);
            }
        }

    } catch (error) {
        console.error("Script Error:", error);
    }
}

findWorkingModel();
