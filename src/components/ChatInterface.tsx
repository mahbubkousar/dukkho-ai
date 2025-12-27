import { useRef, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faBars } from "@fortawesome/free-solid-svg-icons";
import DukkhoMeter from "./DukkhoMeter";
import ChatBubble from "./ChatBubble";
import Sidebar from "./Sidebar";
import TypingIndicator from "./TypingIndicator";
import {
    createChat,
    addMessage,
    getUserChats,
    getChatMessages,
    deleteChat,
    updateChatTitle,
    toggleChatPin,
    updateChatScore, // Import updateChatScore
    Chat
} from "@/lib/chatService";

export default function ChatInterface() {
    const { user, logOut } = useAuth();
    const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const shouldLoadRef = useRef(true);

    // History State
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentScore, setCurrentScore] = useState(0); // Add Score State

    // Initial Load: Fetch user chats
    useEffect(() => {
        if (user) {
            loadChats();
        }
    }, [user]);

    // Load Messages when Active Chat Changes
    useEffect(() => {
        if (activeChatId && shouldLoadRef.current) {
            loadMessages(activeChatId);
        } else {
            shouldLoadRef.current = true;
        }
        if (!activeChatId) {
            setMessages([]);
            setCurrentScore(0);
        }
    }, [activeChatId]);

    const loadChats = async () => {
        if (!user) return;
        const userChats = await getUserChats(user.uid);
        setChats(userChats);
    };

    const loadMessages = async (chatId: string) => {
        setIsLoading(true);
        const msgs = await getChatMessages(chatId);
        setMessages(msgs.map(m => ({ role: m.role, text: m.text })));

        // Find current chat to set score
        const currentChat = chats.find(c => c.id === chatId);
        if (currentChat) {
            setCurrentScore(currentChat.score || 0);
        }

        setIsLoading(false);
    };

    // ... (Existing handlers: handleNewChat, handleDeleteChat, etc.) ...

    const handleNewChat = async () => {
        setActiveChatId(null);
        setMessages([]);
        setCurrentScore(0);
        setIsSidebarOpen(false);
    };

    const handleDeleteChat = async (chatId: string) => {
        if (!confirm("আপনি কি নিশ্চিত যে আপনি এই চ্যাটটি মুছে ফেলতে চান?")) return;
        await deleteChat(chatId);
        if (activeChatId === chatId) {
            setActiveChatId(null);
            setMessages([]);
            setCurrentScore(0);
        }
        await loadChats();
    };

    const handleRenameChat = async (chatId: string, newTitle: string) => {
        await updateChatTitle(chatId, newTitle);
        await loadChats();
    };

    const handleTogglePin = async (chatId: string, currentStatus: boolean) => {
        await toggleChatPin(chatId, currentStatus);
        await loadChats();
    };

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !user) return;

        const currentInput = input;
        setInput("");

        // Optimistic UI update
        const newMessages = [...messages, { role: 'user' as const, text: currentInput }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            let currentChatId = activeChatId;

            // If no active chat, create one first
            if (!currentChatId) {
                // Generate a title from the first few words
                const title = currentInput.slice(0, 30) + (currentInput.length > 30 ? "..." : "");
                currentChatId = await createChat(user.uid, title);

                // Prevent useEffect from wiping our state
                shouldLoadRef.current = false;
                setActiveChatId(currentChatId);
                await loadChats(); // Refresh sidebar list
            }

            // Save user message to Firestore
            await addMessage(currentChatId!, 'user', currentInput);

            // Fetch AI Response
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: currentInput, history: newMessages.slice(0, -1) }), // Send history context
            });

            if (!response.ok) throw new Error("Failed to fetch");
            if (!response.body) throw new Error("No response body");

            // Prepare for streaming response
            let aiResponseText = "";
            let buffer = ""; // To hold chunks for tag parsing
            let tempScore = 0;

            setMessages(prev => [...prev, { role: 'model', text: "" }]); // Add placeholder

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Only modify aiResponseText with content BEFORE the tag if detected partially?
                // Actually, simplest strategy: Stream everything to state, but visually hide the tag later? 
                // OR: Parse buffer carefully. 
                // Given the prompt puts it strictly at the end, we can validly display mostly everything until we see ||.

                // Let's just accumulate text. We will handle the cleanup in the final step or use regex on the fly.
                // Regex on the fly is better to prevent showing "||SCORE" to user.

                // Check if buffer contains the score pattern
                const scoreMatch = buffer.match(/\|\|SCORE:\s*(\d+)\|\|/);
                let textToDisplay = buffer;

                if (scoreMatch) {
                    tempScore = parseInt(scoreMatch[1]);
                    // Remove the tag from the buffer for display
                    textToDisplay = buffer.replace(scoreMatch[0], "");
                }

                aiResponseText = textToDisplay;

                setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1] = { role: 'model', text: textToDisplay };
                    return newMsgs;
                });
            }

            // After stream ends, if we found a score, update it
            if (tempScore > 0) {
                // Update local state (cumulative)
                const newTotalScore = currentScore + tempScore;
                setCurrentScore(newTotalScore);

                // Update Firestore
                await updateChatScore(currentChatId!, newTotalScore);
                // Also refresh chats to update sidebar badge eventually
                await loadChats();
            }

            // Save cleaned AI response to Firestore
            await addMessage(currentChatId!, 'model', aiResponseText);

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: "দুঃখিত, আমি একটু ব্যস্ত আছি। পরে আবার চেষ্টা করো।" }]); // Error message in Bangla
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                chats={chats}
                activeChatId={activeChatId}
                onSelectChat={setActiveChatId}
                onNewChat={handleNewChat}
                onLogout={logOut}
                onDeleteChat={handleDeleteChat}
                onRenameChat={handleRenameChat}
                onTogglePin={handleTogglePin}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative">

                {/* Header */}
                <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-purple-100 absolute top-0 w-full z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden text-gray-600 hover:text-purple-600 transition-colors"
                        >
                            <FontAwesomeIcon icon={faBars} size="lg" />
                        </button>
                        <div className="relative h-8 md:h-10">
                            <img src="/navbar_image.png" alt="Dukkho AI" className="object-contain h-full w-auto drop-shadow-sm" />
                        </div>
                    </div>

                    {/* Dukkho Score Meter */}
                    <div className="mr-2">
                        <DukkhoMeter score={currentScore} />
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto pt-24 pb-24 px-4 md:px-10 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60 font-body animate-fade-in-up">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-50 text-center max-w-sm flex flex-col items-center">
                                <img src="/logo.png" alt="Dukkho AI" className="w-20 h-20 mb-4 opacity-90 drop-shadow-md animate-bounce-slow" />
                                <p className="mb-2 text-xl font-bold text-gray-600">কিছু নিয়ে মন খারাপ?</p>
                                <p className="text-sm">বলুন, আমি শুনছি।</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <ChatBubble key={index} role={msg.role} text={msg.text} />
                        ))
                    )}

                    {isLoading && messages[messages.length - 1]?.role !== 'model' && (
                        <TypingIndicator />
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-sm p-4 border-t border-purple-50 z-10">
                    <div className="flex items-center gap-2 max-w-4xl mx-auto">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="আপনার কষ্টের কথা শেয়ার করুন..."
                            className="flex-1 bg-gray-50 text-gray-800 rounded-full px-5 py-3 border border-purple-100 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400 font-body shadow-inner"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
