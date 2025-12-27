Act as a Senior Full Stack Engineer and UI/UX Designer. I want you to build a web application called "Dukkho AI" (Sadness AI). 

## Project Overview
Dukkho AI is a satirical, mobile-first chatbot that speaks in Bengali (and Banglish). Instead of offering sympathy when users share sad stories, the bot "roasts" them with wit, satire, and savage humor. 

## Tech Stack Requirements (Strict)
1.  **Framework:** Next.js 14+ (App Router) - optimized for speed and SEO.
2.  **Language:** TypeScript.
3.  **Styling:** Tailwind CSS + Framer Motion (for smooth, elegant animations).
4.  **Backend/Auth:** Firebase v9 (Authentication via Google Provider & Firestore for chat history).
5.  **AI Integration:** Google Gemini API (using the `google-generative-ai` package).
6.  **Hosting Target:** Netlify (Ensure `next.config.js` and build settings are compatible).
7.  **Font:** Use 'Hind Siliguri' (from Google Fonts) for Bengali text to ensure it looks elegant and native.

## Design Philosophy & UX
* **Vibe:** Minimalist, Dark Mode by default. High contrast but easy on the eyes.
* **Mobile-First:** The UI must look and feel like a native mobile app (WhatsApp/Messenger style) with a fixed bottom input bar.
* **Typography:** Clean, readable, with a unique "Tech/Cyber" aesthetic.
* **Latency:** The chat response must stream in real-time (typewriter effect) to ensure the user feels "zero latency."
* **Graphic Elements:** Keep placeholder for graphic elements so that i can replace with relevant icons/logo/images. Use fontawesome icons where needed instead of emojis in the UI. Chat response may contain emojis. 

## Core Features to Implement

### 1. Authentication
* Create a clean Login page with a "Sign in with Google" button.
* Redirect to the Chat interface upon success.
* Persist user sessions.

### 2. The Chat Interface
* **Header:** Simple title "দুঃখ এআই" with a logout button.
* **Message List:** * User bubbles: Aligned right, subtle accent color.
    * AI bubbles: Aligned left, distinct minimal style.
    * Render Markdown (bolding, lists) properly.
* **Input Area:** Text input, Send button.

### 3. The "Savage" Persona (Backend Logic)
Create a Next.js API Route (`/api/chat`) to handle requests. Do not expose the API key on the client.
* **System Instruction:** Initialize the Gemini model with this strict persona: 
    "You are Dukkho AI. You are a savage, witty, and satirical Bengali assistant. You speak in a mix of Bangla and English (Banglish). When the user complains or shares sad news, DO NOT be sympathetic. Instead, find the humor in their misery, roast them lightly, and make a joke out of it. However, if the user mentions genuine self-harm or extreme danger, break character and be helpful. Keep responses concise and conversational."

### 4. Image Generation Trigger
* If the user asks for a "meme" or "image" in the chat, use a placeholder logic (or call an image API if configured) to return an image card in the chat stream. If possible provide meme image to the messages that may need, but user didn't explicitly ask for. 

## Implementation Steps
1.  Initialize the Next.js app with Tailwind.
2.  Set up the Firebase config file (I will provide keys later).
3.  Create the API route for Gemini with streaming enabled.
4.  Build the UI components (ChatBubble, Input, Layout).
5.  Connect the UI to the API and Firebase.

## Output Request
Start by generating the project structure and the core code for `page.tsx`, `layout.tsx`, the API route, and the Firebase setup. Focus on writing clean, modular code.