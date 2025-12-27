"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function LoginPage() {
    const { user, signInWithGoogle, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    if (loading) return null;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden font-body">
            {/* Background Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-[600px] h-[600px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-lg mx-auto">
                {/* Sad Robot Image */}
                <div className="mb-8 relative w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
                    <img
                        src="/sad-robot.png"
                        alt="Sad Funny Robot"
                        className="object-contain w-full h-full rounded-2xl"
                    />
                </div>

                {/* Title Section */}
                <div className="text-center space-y-4 mb-10">
                    <h1 className="text-5xl md:text-7xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 drop-shadow-sm pb-2">
                        দুঃখ এআই
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl font-body font-medium tracking-wide">
                        আপনার ব্যক্তিগত প্যারাসঙ্গী। <br />
                        <span className="text-sm text-gray-400 font-normal opacity-80">(আমরা আপনার কষ্টে হাসি, যাতে আপনি না কাঁদেন)</span>
                    </p>
                </div>

                {/* Login Button */}
                <button
                    onClick={signInWithGoogle}
                    className="group relative w-full flex items-center justify-center gap-4 bg-white/80 backdrop-blur-sm text-gray-800 px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1 active:scale-95 border border-white/50 hover:border-purple-200 font-body overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <FontAwesomeIcon icon={faGoogle} className="text-2xl text-red-500 relative z-10 group-hover:scale-110 transition-transform" />
                    <span className="relative z-10 text-lg">গুগল দিয়ে শুরু করুন</span>
                </button>

                {/* Footer Quote */}
                <div className="mt-12 text-center">
                    <p className="text-gray-400 text-sm font-body italic flex items-center justify-center gap-2">
                        <span className="text-2xl text-purple-200">❝</span>
                        একদিন পৃথিবী ধ্বংস হবে
                        <span className="text-2xl text-purple-200">❞</span>
                    </p>
                </div>
            </main>
        </div>
    );
}
