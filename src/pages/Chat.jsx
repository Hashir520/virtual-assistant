import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import { FiMenu, FiSend, FiMoreVertical, FiPaperclip, FiMic, FiSmile, FiHelpCircle, FiInfo, FiPlus, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Chat = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (chatId) {
            loadChat(chatId);
        } else {
            setMessages([]);
        }
    }, [chatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadChat = async (id) => {
        setLoading(true);
        try {
            const response = await chatAPI.getChat(id);
            setMessages(response.chat.messages);
        } catch (error) {
            console.error('Error loading chat:', error);
            toast.error('Failed to load chat');
            navigate('/chat');
        } finally {
            setLoading(false);
        }
    };

    const getMockResponse = (message) => {
        const lowerMessage = message.toLowerCase();
        const responses = {
            hello: ["Hello! 👋 How can I make your day better?", "Hi there! 🌟 Ready to help you!", "Greetings! 💫 What brings you here today?"],
            how: ["I'm absolutely fantastic! ✨ Thanks for asking! How can I assist you?", "Doing great! 🚀 Ready to tackle any challenge you throw my way!"],
            help: ["I'm your personal AI assistant! 🎯 I can help with questions, tasks, coding, research, and so much more. What do you need?", "Consider me your digital sidekick! 💪 Ask me anything - from simple queries to complex problems."],
            time: [`🕐 The current time is ${new Date().toLocaleTimeString()}. Need anything else?`],
            joke: ["Why do programmers prefer dark mode? 🎭 Because light attracts bugs! 😂", "What's a computer's favorite beat? 🎵 Micro-soft! 🥁"],
            thanks: ["You're absolutely welcome! 🌈 Happy to help anytime!", "My pleasure! 💫 That's what I'm here for!"],
            bye: ["Goodbye! 👋 Have a wonderful day! Come back anytime!", "See you later! 🌟 Take care and stay awesome!"]
        };
        
        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return Array.isArray(value) ? value[Math.floor(Math.random() * value.length)] : value;
            }
        }
        return `Thanks for your message! 💭 "${message.substring(0, 50)}" - Let me think about that and get back to you with the best possible answer! 🚀`;
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = {
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        const currentMessage = inputMessage;
        setInputMessage('');
        setIsTyping(true);

        // Reset textarea height
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }

        try {
            const response = await chatAPI.sendMessage(currentMessage, chatId);
            const assistantMessage = {
                role: 'assistant',
                content: response.response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
            if (!chatId && response.chatId) {
                navigate(`/chat/${response.chatId}`);
            }
        } catch (error) {
            console.log('Using mock response');
            const mockResponse = getMockResponse(currentMessage);
            const assistantMessage = {
                role: 'assistant',
                content: mockResponse,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSelectChat = (id) => {
        navigate(`/chat/${id}`);
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="h-screen flex overflow-hidden relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
            {/* Professional Background */}
            <div className="fixed inset-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url("https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1600")',
                        backgroundAttachment: 'fixed'
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-purple-900/85"></div>
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px'
                }}></div>
            </div>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-30 transform transition-all duration-500 ease-in-out lg:relative lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar 
                    isOpen={sidebarOpen} 
                    setIsOpen={setSidebarOpen}
                    chats={chats}
                    setChats={setChats}
                    onSelectChat={handleSelectChat}
                />
            </div>
            
            {/* Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col w-full lg:ml-0 overflow-hidden relative z-10">
                {/* Header */}
                <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-xl flex-shrink-0">
                    <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button 
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300 active:scale-95"
                            >
                                <FiMenu size={22} />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-base sm:text-lg">A</span>
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-white/20 animate-pulse"></div>
                                </div>
                                <div>
                                    <h1 className="text-white font-semibold text-base sm:text-lg">AVA Assistant</h1>
                                    <p className="text-white/50 text-[10px] sm:text-xs">AI Ready • 24/7 Online</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="p-1.5 sm:p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300">
                                <FiHelpCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                            <button className="p-1.5 sm:p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300">
                                <FiInfo size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                            <button className="p-1.5 sm:p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300">
                                <FiMoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages Area with gaps and highlighting */}
                <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 scroll-smooth">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-3 border-blue-400/30 border-t-blue-500"></div>
                                </div>
                                <p className="text-white/60 text-xs sm:text-sm">Loading conversation...</p>
                            </div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto px-4">
                            <div className="relative mb-6 sm:mb-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-2xl opacity-60 animate-pulse"></div>
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-500">
                                    <span className="text-3xl sm:text-4xl">✨</span>
                                </div>
                            </div>
                            
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
                                Welcome to AVA
                            </h2>
                            <p className="text-white/60 max-w-md mb-8 sm:mb-10 text-sm sm:text-base px-4">
                                Your intelligent virtual assistant, ready to help you 24/7
                            </p>
                            
                            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-2">
                                {[
                                    { emoji: "What can you do?💬", text: "What can you do?" },
                                    { emoji: "Tell me a joke😂", text: "Tell me a joke" },
                                    { emoji: "What's the time?🕐", text: "What's the time?" },
                                    { emoji: "Help me with coding🎯", text: "Help me with coding" }
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion.text}
                                        onClick={() => {
                                            setInputMessage(suggestion.text);
                                            setTimeout(() => {
                                                inputRef.current?.focus();
                                            }, 100);
                                        }}
                                        className="px-3 sm:px-5 py-1.5 sm:py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 hover:bg-white/10 rounded-full text-xs sm:text-sm text-white/80 hover:text-white transition-all duration-300"
                                    >
                                        <span className="mr-1">{suggestion.emoji}</span>
                                        <span className="hidden xs:inline">{suggestion.text}</span>
                                    </button>
                                ))}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 max-w-lg px-4">
                                <div className="text-center">
                                    <div className="text-xl sm:text-2xl mb-1 sm:mb-2">⚡</div>
                                    <p className="text-white/60 text-[10px] sm:text-xs">Instant Responses</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🔒</div>
                                    <p className="text-white/60 text-[10px] sm:text-xs">Secure & Private</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                            {messages.map((msg, idx) => (
                                <ChatMessage 
                                    key={idx} 
                                    message={msg} 
                                    isUser={msg.role === 'user'} 
                                />
                            ))}
                            {isTyping && <TypingIndicator />}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Fixed for all screens */}
                <div className="bg-gradient-to-t from-black/20 via-transparent to-transparent flex-shrink-0">
                    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-5">
                        <form onSubmit={sendMessage} className="flex gap-2 sm:gap-3 items-end">
                            <div className="flex-1 relative group">
                                <div className="absolute left-2 sm:left-3 bottom-2 sm:bottom-3 flex items-center gap-0.5 sm:gap-1">
                                    <button 
                                        type="button" 
                                        className="p-1.5 sm:p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-lg active:scale-95"
                                    >
                                        <FiPaperclip size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    </button>
                                    <button 
                                        type="button" 
                                        className="p-1.5 sm:p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-lg active:scale-95"
                                    >
                                        <FiSmile size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    </button>
                                </div>
                                <textarea
                                    ref={inputRef}
                                    rows="1"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage(e);
                                        }
                                    }}
                                    placeholder="Type your message..."
                                    className="w-full pl-16 sm:pl-24 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-white/15 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base resize-none overflow-hidden text-white placeholder-white/40"
                                    disabled={isTyping}
                                    style={{ minHeight: '44px', maxHeight: '120px' }}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                    }}
                                />
                                <div className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3">
                                    <button
                                        type="button"
                                        className="p-1.5 sm:p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-lg active:scale-95"
                                    >
                                        <FiMic size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isTyping}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl active:scale-95 transform"
                            >
                                <FiSend size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="hidden xs:inline text-sm">Send</span>
                            </button>
                        </form>
                        <p className="text-white/30 text-[10px] sm:text-xs text-center mt-2 sm:mt-3">
                            Press Enter to send • Shift + Enter for new line
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;