import React from 'react';
import { FiCpu } from 'react-icons/fi';

const TypingIndicator = () => {
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <FiCpu size={16} className="text-white" />
            </div>
            <div className="bg-gray-200 rounded-lg p-3">
                <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;