import React from 'react';

const TypingIndicator = () => {
    return (
        <div className="flex items-center space-x-1 bg-white border border-purple-100 p-3 rounded-2xl rounded-bl-none shadow-sm w-fit ml-2 mt-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
        </div>
    );
};

export default TypingIndicator;
