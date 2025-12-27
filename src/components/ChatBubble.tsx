import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

import remarkBreaks from "remark-breaks";

interface ChatBubbleProps {
    role: "user" | "model";
    text: string;
}

export default function ChatBubble({ role, text }: ChatBubbleProps) {
    const isUser = role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[85%] md:max-w-[75%] px-5 py-3 text-sm md:text-base leading-relaxed break-words shadow-sm transition-all font-body ${isUser
                    ? "bg-gradient-to-br from-purple-100 to-pink-100 text-gray-800 rounded-2xl rounded-tr-none border border-purple-200"
                    : "bg-white/90 backdrop-blur-sm text-gray-800 rounded-2xl rounded-tl-none border border-white shadow-sm ring-1 ring-purple-50"
                    }`}
            >
                <ReactMarkdown
                    remarkPlugins={[remarkBreaks]}
                    components={{
                        // Custom styling for markdown elements if needed
                        strong: ({ node, ...props }) => <span className="font-bold text-current" {...props} />,
                        blockquote: ({ node, ...props }) => (
                            <div className="bg-purple-50/80 border-l-4 border-purple-400 pl-4 py-2 pr-2 my-2 rounded-r-lg italic text-gray-700 shadow-sm">
                                {props.children}
                            </div>
                        ),
                    }}
                >
                    {text}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
}
