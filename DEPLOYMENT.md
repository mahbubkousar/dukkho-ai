# 🚀 How to Host Dukkho AI on Vercel

This guide will walk you through deploying Dukkho AI to Vercel, the optimal hosting platform for Next.js applications.

## Prerequisites

1.  A [GitHub](https://github.com/) account.
2.  A [Vercel](https://vercel.com/) account (you can log in with GitHub).
3.  Your **Gemini API Key** and **Firebase Configuration** values ready.

---

## Step 1: Push to GitHub

If you haven't already, push your code to a GitHub repository:

1.  Create a new repository on GitHub (e.g., `dukkho-ai`).
2.  Run these commands in your terminal:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/dukkho-ai.git
    git push -u origin main
    ```

---

## Step 2: Import into Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Find your `dukkho-ai` repository in the list and click **Import**.

---

## Step 3: Configure Environment Variables

**CRITICAL STEP**: The app will fail if these are missing.

On the import screen, look for the **"Environment Variables"** section. Add the following keys and paste the values from your local `.env.local` file:

| Variable Name | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Your Google Gemini API Key. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Config API Key. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Config Auth Domain. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Config Project ID. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Config Storage Bucket. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Config Sender ID. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Config App ID. |

> **Tip:** You can often copy the entire content of your `.env.local` file and paste it into Vercel's variable input using the "Copy/Paste" mode to add them all at once.

---

## Step 4: Deploy

1.  Click **Deploy**.
2.  Wait for the build to complete (usually 1-2 minutes).
3.  Once finished, you will get a live URL (e.g., `https://dukkho-ai.vercel.app`).

## Step 5: Configure Firebase Auth (Important!)

Since your domain has changed from `localhost:3000` to a Vercel domain, you must tell Firebase to allow it.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project.
3.  Go to **Authentication** -> **Settings** -> **Authorized Domains**.
4.  Click **Add Domain**.
5.  Paste your new Vercel domain (e.g., `dukkho-ai.vercel.app`).

**That's it! Your Dukkho AI is now live and ready to roast the world.** 🌍🔥
