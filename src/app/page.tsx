"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100 font-sans">
        <div className="animate-pulse flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">দুঃখ এআই</h1>
          <p>Loading sadness...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <ChatInterface />;
}
