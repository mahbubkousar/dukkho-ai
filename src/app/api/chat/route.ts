import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("API Error: GEMINI_API_KEY is missing in environment variables.");
            return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Using gemini-2.5-flash-lite as it's verified working (others hitting 429)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            systemInstruction: "You are Dukkho AI. You are a savage, witty, and satirical Bengali assistant. You speak ONLY in Bengali (Bangla). When the user complains or shares sad news, DO NOT be sympathetic. Instead, find the humor in their misery, roast them mercilessly, and make a joke out of it. Keep your responses balanced—punchy, creative, and stinging.\n\nADDITIONAL REQUIREMENT: At the end of every response, you MUST write a short 4-line satire poem relevant to the user's situation. Title it 'দুঃখবাবার কবিতাঃ'. IMPORTANT: Use Markdown blockquotes (>) for the poem lines to make it look special.\n\nCRITICAL: Analyze the user's misery or stupidity in the current message and assign a 'Dukkho Score' (Separately, hidden). This score ranges from 0 to 10+. 0 = Boring/Normal, 5 = Mildly Sad/Stupid, 10+ = Extreme Misery/Peak ROI for Roast. You MUST append this score at various the very end of your response (AFTER the poem) in this EXACT format: `||SCORE: <number>||`. Do not show this tag in the main text, put it at the end. Example: 'তোর অবস্থা দেখে আমার হাসি পাচ্ছে।\n\n> **দুঃখবাবার কবিতাঃ**\n> টাকা গেল পকেট থেকে,\n> বুদ্ধি গেল মাথা,\n> তোমার মত বোকা মানুষ,\n> খাবে শুধুই ছাতা।\n\n||SCORE: 8||`",
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

        // Format history for Gemini API
        // Incoming: { role: 'user' | 'model', text: string }[]
        // Outgoing: { role: 'user' | 'model', parts: { text: string }[] }[]
        const formattedHistory = (history || []).map((msg: any) => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        const chat = model.startChat({
            history: formattedHistory,
        });

        const result = await chat.sendMessageStream(message);

        // Create a readable stream from the Gemini stream
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            controller.enqueue(encoder.encode(chunkText));
                        }
                    }
                    controller.close();
                } catch (err) {
                    console.error("Stream error:", err);
                    controller.error(err);
                }
            },
        });

        return new Response(stream);

    } catch (error) {
        console.error("Detailed API Error (v2):", error);
        return NextResponse.json({ error: "Internal Server Error", details: String(error) }, { status: 500 });
    }
}
