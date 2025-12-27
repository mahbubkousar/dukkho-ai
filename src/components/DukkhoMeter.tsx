import { motion } from "framer-motion";

interface DukkhoMeterProps {
    score: number;
}

export default function DukkhoMeter({ score }: DukkhoMeterProps) {
    // Futuristic Logic:
    // Segmented blocks instead of smooth bar.
    // Neon glow effects.

    // Cap at 100 for visual percentage (logic can handle >100)
    const normalizedScore = Math.min(Math.max(score, 0), 100);
    const totalSegments = 10;
    const filledSegments = Math.round((normalizedScore / 100) * totalSegments);

    // Dynamic Color Logic based on intensity
    let glowColor = "shadow-green-500/50";
    let barColor = "bg-green-400";
    let textColor = "text-green-500";

    if (score > 30) {
        glowColor = "shadow-yellow-500/50";
        barColor = "bg-yellow-400";
        textColor = "text-yellow-600";
    }
    if (score > 60) {
        glowColor = "shadow-orange-500/50";
        barColor = "bg-orange-500";
        textColor = "text-orange-600";
    }
    if (score > 80) {
        glowColor = "shadow-red-500/50";
        barColor = "bg-red-500";
        textColor = "text-red-600";
    }

    return (
        <div className="relative group scale-90 md:scale-100 origin-right">
            {/* Holographic Container */}
            <div className={`
                relative overflow-hidden
                flex items-center gap-2 md:gap-4 px-2 py-1 md:px-4 md:py-2 
                bg-white/10 backdrop-blur-md 
                border border-white/40 
                rounded-xl shadow-lg 
                ${score > 80 ? "animate-pulse border-red-200/50" : ""}
            `}>
                {/* Glitchy Text Label */}
                <div className="flex flex-col items-start">
                    <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                        DUKKHO LVL
                    </span>
                    <span className={`text-lg md:text-2xl font-black font-mono leading-none ${textColor} drop-shadow-sm`}>
                        {score}
                        <span className="text-[10px] md:text-xs ml-1 text-gray-400 font-sans">%</span>
                    </span>
                </div>

                {/* Segmented Bar */}
                <div className="flex gap-0.5 md:gap-1 h-5 md:h-8 items-end">
                    {[...Array(totalSegments)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: "20%" }}
                            animate={{
                                height: i < filledSegments ? "100%" : "20%",
                                opacity: i < filledSegments ? 1 : 0.3
                            }}
                            className={`
                                w-1.5 md:w-2 rounded-sm transition-all duration-300
                                ${i < filledSegments ? `${barColor} shadow-[0_0_10px_2px_rgba(0,0,0,0)] ${glowColor}` : "bg-gray-300"}
                            `}
                        />
                    ))}
                </div>
            </div>

            {/* Reflective shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
        </div>
    );
}
