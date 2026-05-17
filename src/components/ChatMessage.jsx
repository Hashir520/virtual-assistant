import React from 'react';
import { FiUser, FiCpu } from 'react-icons/fi';

const ChatMessage = ({ message, isUser }) => {
    return (
        <div className={`flex gap-3 message-animation ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <FiCpu size={16} className="text-white" />
                </div>
            )}
            <div className={`max-w-[70%] rounded-lg p-3 ${
                isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800'
            }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className={`text-xs mt-1 block ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                </span>
            </div>
            {isUser && (
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                    <FiUser size={16} className="text-white" />
                </div>
            )}
        </div>
    );
};

export default ChatMessage;