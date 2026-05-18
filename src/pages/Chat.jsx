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
                {/* Background Image with proper cover */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url("https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1600")',
                        backgroundAttachment: 'fixed'
                    }}
                ></div>
                
                {/* Professional Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-purple-900/85"></div>
                
                {/* Subtle Grid Pattern */}
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
                {/* Header - Professional Glassmorphism */}
                <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-xl">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                            >
                                <FiMenu size={22} />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-lg">A</span>
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white/20 animate-pulse"></div>
                                </div>
                                <div>
                                    <h1 className="text-white font-semibold text-lg">AVA Assistant</h1>
                                    <p className="text-white/50 text-xs">AI Ready • 24/7 Online</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300">
                                <FiHelpCircle size={18} />
                            </button>
                            <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300">
                                <FiInfo size={18} />
                            </button>
                            <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300">
                                <FiMoreVertical size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-400/30 border-t-blue-500"></div>
                                </div>
                                <p className="text-white/60 text-sm">Loading conversation...</p>
                            </div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
                            {/* Welcome Avatar */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-2xl opacity-60 animate-pulse"></div>
                                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-500">
                                    <span className="text-4xl">✨</span>
                                </div>
                            </div>
                            
                            <h2 className="text-3xl font-bold text-white mb-3">
                                Welcome to AVA
                            </h2>
                            <p className="text-white/60 max-w-md mb-10 text-base">
                                Your intelligent virtual assistant, ready to help you 24/7
                            </p>
                            
                            {/* Suggestion Chips */}
                            <div className="flex flex-wrap gap-3 justify-center">
                                {[
                                    { emoji: "💬", text: "What can you do?" },
                                    { emoji: "😂", text: "Tell me a joke" },
                                    { emoji: "🕐", text: "What's the time?" },
                                    { emoji: "🎯", text: "Help me with coding" }
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion.text}
                                        onClick={() => {
                                            setInputMessage(suggestion.text);
                                            setTimeout(() => {
                                                inputRef.current?.focus();
                                            }, 100);
                                        }}
                                        className="group px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 hover:bg-white/10 rounded-full text-sm text-white/80 hover:text-white transition-all duration-300"
                                    >
                                        <span className="mr-1">{suggestion.emoji}</span>
                                        {suggestion.text}
                                    </button>
                                ))}
                            </div>
                            
                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-white/10 max-w-lg">
                                <div className="text-center">
                                    <div className="text-2xl mb-2">⚡</div>
                                    <p className="text-white/60 text-xs">Instant Responses</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl mb-2">🔒</div>
                                    <p className="text-white/60 text-xs">Secure & Private</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto">
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

                {/* Input Area - Professional Glassmorphism */}
                <div className="bg-gradient-to-t from-black/20 via-transparent to-transparent">
                    <div className="max-w-4xl mx-auto px-6 py-5">
                        <form onSubmit={sendMessage} className="flex gap-3 items-end">
                            <div className="flex-1 relative group">
                                <div className="absolute left-3 bottom-3 flex items-center gap-1">
                                    <button type="button" className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-lg">
                                        <FiPaperclip size={18} />
                                    </button>
                                    <button type="button" className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-lg">
                                        <FiSmile size={18} />
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
                                    className="w-full pl-24 pr-12 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-base resize-none overflow-hidden text-white placeholder-white/30"
                                    disabled={isTyping}
                                    style={{ minHeight: '52px', maxHeight: '150px' }}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
                                    }}
                                />
                                <div className="absolute right-3 bottom-3">
                                    <button
                                        type="button"
                                        className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-lg"
                                    >
                                        <FiMic size={18} />
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isTyping}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl px-6 py-3 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:scale-105 transform"
                            >
                                <FiSend size={18} />
                                <span className="hidden sm:inline text-sm">Send</span>
                            </button>
                        </form>
                        <p className="text-white/30 text-xs text-center mt-3">
                            Press Enter to send • Shift + Enter for new line
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;