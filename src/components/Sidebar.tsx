import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMessage, faSignOutAlt, faEllipsisV, faThumbtack, faTrash, faPen, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Chat } from "@/lib/chatService";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    chats: Chat[];
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onNewChat: () => void;
    onLogout: () => void;
    onDeleteChat: (chatId: string) => void;
    onRenameChat: (chatId: string, newTitle: string) => void;
    onTogglePin: (chatId: string, currentStatus: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    chats,
    activeChatId,
    onSelectChat,
    onNewChat,
    onLogout,
    onDeleteChat,
    onRenameChat,
    onTogglePin
}) => {
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEditStart = (chat: Chat) => {
        setEditingChatId(chat.id);
        setEditTitle(chat.title);
        setMenuOpenId(null);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingChatId && editTitle.trim()) {
            onRenameChat(editingChatId, editTitle.trim());
            setEditingChatId(null);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-gray-50/95 backdrop-blur-xl border-r border-purple-100 z-30 shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Header */}
                <div className="p-3 border-b border-purple-100 flex justify-between items-center">
                    <button
                        onClick={() => {
                            onNewChat();
                            if (window.innerWidth < 768) onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-white text-gray-700 hover:text-purple-600 border border-purple-100 hover:border-purple-300 rounded-lg px-3 py-2 text-sm font-medium transition-all shadow-sm active:scale-95 font-body"
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-purple-500" />
                        <span>নতুন চ্যাট</span>
                    </button>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="md:hidden ml-2 text-gray-400 hover:text-gray-600 p-2">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-purple-200">
                    {chats.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10 font-body text-xs">
                            কোনো চ্যাট হিস্ট্রি নেই
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {chats.map((chat) => (
                                <li key={chat.id} className="relative group">
                                    {editingChatId === chat.id ? (
                                        <form onSubmit={handleEditSubmit} className="p-1">
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                onBlur={() => setEditingChatId(null)}
                                                className="w-full text-sm px-2 py-1 rounded border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400 font-body"
                                            />
                                        </form>
                                    ) : (
                                        <div
                                            className={`flex items-center justify-between p-2 rounded-lg text-sm transition-all cursor-pointer font-body ${activeChatId === chat.id
                                                ? "bg-white text-purple-700 shadow-sm border border-purple-100 font-medium"
                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                }`}
                                            onClick={() => {
                                                onSelectChat(chat.id);
                                                if (window.innerWidth < 768) onClose();
                                            }}
                                        >
                                            <div className="flex items-center gap-2 truncate flex-1">
                                                <FontAwesomeIcon
                                                    icon={chat.pinned ? faThumbtack : faMessage}
                                                    className={`text-xs ${chat.pinned ? "text-pink-500 rotate-45" : (activeChatId === chat.id ? "text-purple-500" : "text-gray-400")}`}
                                                />
                                                <div className="flex flex-col truncate">
                                                    <span className="truncate block font-medium">{chat.title || "নতুন চ্যাট"}</span>
                                                    {chat.score !== undefined && chat.score > 0 && (
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full w-fit mt-0.5 ${chat.score > 80 ? "bg-red-100 text-red-600" :
                                                            chat.score > 30 ? "bg-orange-100 text-orange-600" :
                                                                "bg-green-100 text-green-600"
                                                            }`}>
                                                            দুঃখ: {chat.score}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Menu Trigger */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMenuOpenId(menuOpenId === chat.id ? null : chat.id);
                                                }}
                                                className={`p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-opacity md:opacity-0 md:group-hover:opacity-100 ${menuOpenId === chat.id ? 'opacity-100 bg-gray-200' : ''}`}
                                            >
                                                <FontAwesomeIcon icon={faEllipsisV} className="text-xs w-3 h-3" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Dropdown Menu */}
                                    {menuOpenId === chat.id && (
                                        <div
                                            ref={menuRef}
                                            className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden text-xs font-body animate-fade-in-down"
                                        >
                                            <button
                                                onClick={() => {
                                                    onTogglePin(chat.id, !!chat.pinned);
                                                    setMenuOpenId(null);
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                            >
                                                <FontAwesomeIcon icon={faThumbtack} className="text-gray-400 w-3" />
                                                <span>{chat.pinned ? "আনপিন" : "পিন করুন"}</span>
                                            </button>
                                            <button
                                                onClick={() => handleEditStart(chat)}
                                                className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                            >
                                                <FontAwesomeIcon icon={faPen} className="text-gray-400 w-3" />
                                                <span>রিনেম</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onDeleteChat(chat.id);
                                                    setMenuOpenId(null);
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-red-400 w-3" />
                                                <span>মুছে ফেলুন</span>
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-purple-100 bg-gray-50 flex flex-col gap-2">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 font-body text-sm"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>লগ আউট</span>
                    </button>

                    {/* Developer Credit */}
                    <div className="text-[10px] text-center text-gray-400 font-sans pt-2 border-t border-gray-100">
                        Developed by <a href="https://mahbubkousar.github.io" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-600 font-medium transition-colors">Mahbub Kousar</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
