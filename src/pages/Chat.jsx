import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import { FiMenu, FiSend, FiMoreVertical, FiPaperclip, FiMic, FiSmile, FiHelpCircle, FiInfo } from 'react-icons/fi';
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
    const [isMobile, setIsMobile] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Detect mobile screen
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
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
    }, [messages, isTyping]);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
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
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
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
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    // Auto-resize textarea
    const handleTextareaInput = (e) => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
        setInputMessage(textarea.value);
    };

    return (
        <div className="h-screen flex overflow-hidden relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
            {/* Professional Background */}
            <div className="fixed inset-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url("https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1600")',
                        backgroundAttachment: isMobile ? 'scroll' : 'fixed'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-purple-900/85" />
                <div className="absolute inset-0 opacity-5 hidden md:block" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px'
                }} />
            </div>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                w-[280px] sm:w-[320px] lg:w-80
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
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-35 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                />
            )}
            
            {/* Main Chat Area - Fixed header and input, scrollable messages */}
            <div className="flex-1 flex flex-col w-full lg:ml-0 overflow-hidden relative z-10 h-full">
                {/* Header - Fixed at top */}
                <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-xl flex-shrink-0 sticky top-0 z-20">
                    <div className="px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button 
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300 active:scale-95 -ml-1"
                                aria-label="Open menu"
                            >
                                <FiMenu size={20} />
                            </button>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="relative">
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-sm sm:text-base">A</span>
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full border-2 border-white/20 animate-pulse" />
                                </div>
                                <div>
                                    <h1 className="text-white font-semibold text-sm sm:text-base">
                                        AVA<span className='hidden sm:inline p-2'>Automated Virtual Assistant</span>
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            <button className="p-1.5 sm:p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-95">
                                <FiHelpCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                            <button className="p-1.5 sm:p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-95">
                                <FiInfo size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                            <button className="p-1.5 sm:p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-95">
                                <FiMoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages Area - This will scroll - FIXED: Proper scrollable container */}
                <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto min-h-0 scroll-smooth"
                    style={{ 
                        WebkitOverflowScrolling: 'touch',
                        scrollBehavior: 'smooth'
                    }}
                >
                    <div className="px-2 sm:px-4 py-3 sm:py-4 pb-4">
                        {loading ? (
                            <div className="flex justify-center items-center h-full min-h-[200px]">
                                <div className="flex flex-col items-center gap-3 sm:gap-4">
                                    <div className="relative">
                                        <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-3 border-blue-400/30 border-t-blue-500" />
                                    </div>
                                    <p className="text-white/60 text-xs sm:text-sm">Loading conversation...</p>
                                </div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
                                <div className="relative mb-5 sm:mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-2xl opacity-60 animate-pulse" />
                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-500">
                                        <span className="text-2xl sm:text-3xl">✨</span>
                                    </div>
                                </div>
                                
                                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                                    Welcome to AVA
                                </h2>
                                <p className="text-white/60 max-w-md mb-6 sm:mb-8 text-xs sm:text-sm px-2 sm:px-4">
                                    Your intelligent virtual assistant, ready to help you 24/7
                                </p>
                                
                                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-1 sm:px-2">
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
                                                    textareaRef.current?.focus();
                                                }, 100);
                                            }}
                                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 hover:bg-white/10 rounded-full text-xs sm:text-sm text-white/80 hover:text-white transition-all duration-300 active:scale-95"
                                        >
                                            <span className="mr-1 sm:mr-1.5">{suggestion.emoji}</span>
                                            <span className="hidden xs:inline">{suggestion.text}</span>
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-white/10 max-w-lg px-3 sm:px-4">
                                    <div className="text-center">
                                        <div className="text-lg sm:text-xl mb-1 sm:mb-2">⚡</div>
                                        <p className="text-white/60 text-[10px] sm:text-xs">Instant Responses</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg sm:text-xl mb-1 sm:mb-2">🔒</div>
                                        <p className="text-white/60 text-[10px] sm:text-xs">Secure & Private</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
                                {messages.map((msg, idx) => (
                                    <ChatMessage 
                                        key={idx} 
                                        message={msg} 
                                        isUser={msg.role === 'user'} 
                                    />
                                ))}
                                {isTyping && <TypingIndicator />}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Area - Fixed at bottom */}
                <div className="flex-shrink-0 bg-gradient-to-t from-black/30 via-transparent to-transparent">
                    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
                        <form onSubmit={sendMessage} className="flex gap-2 sm:gap-3 items-end">
                            <div className="flex-1 relative group">
                                <div className="absolute left-1.5 sm:left-2 py-1.5 bottom-2 flex items-center gap-0.5 sm:gap-1">
                                    <button 
                                        type="button" 
                                        className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-lg active:scale-95"
                                        aria-label="Attach file"
                                    >
                                        <FiPaperclip size={14} className="sm:w-4 sm:h-4" />
                                    </button>
                                    <button 
                                        type="button" 
                                        className="text-white/40  hover:text-white hover:bg-white/10 transition-all rounded-lg active:scale-95"
                                        aria-label="Add emoji"
                                    >
                                        <FiSmile size={14} className="sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                                <textarea
                                    ref={textareaRef}
                                    rows={1}
                                    value={inputMessage}
                                    onChange={handleTextareaInput}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage(e);
                                        }
                                    }}
                                    placeholder="Ask anything..."
                                    className="w-full pl-[62px] sm:pl-[72px] pr-8 sm:pr-10 lg:py-1.5 py-2.5 sm:py-2 bg-white/10 border border-white/20 rounded-3xl focus:outline-none focus:border-blue-500/50 focus:bg-white/15 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base resize-none overflow-hidden text-white placeholder-white/40"
                                    disabled={isTyping}
                                    style={{ minHeight: '44px', maxHeight: '100px' }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isTyping}
                                className="bg-gradient-to-r from-blue-600 mb-2 to-indigo-600 text-white rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl active:scale-95 transform flex-shrink-0"
                                aria-label="Send message">
                                <FiSend size={16} className="sm:w-4 sm:h-4" />
                                <span className="hidden xs:inline text-sm">Send</span>
                            </button>
                        </form>
                        <p className="text-white/30 text-[10px] text-center mt-2">
                            Press Enter to send • Shift + Enter for new line
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                /* Ensure proper height calculations on mobile */
                .h-screen {
                    height: 100vh;
                    height: 100dvh; /* Dynamic viewport height for mobile */
                }
                
                /* Prevent body scroll when chat is open */
                body {
                    overflow: hidden;
                    position: fixed;
                    width: 100%;
                    height: 100%;
                }
                
                /* Better touch scrolling on mobile */
                .overflow-y-auto {
                    -webkit-overflow-scrolling: touch;
                }
                
                /* Adjust textarea for mobile */
                @media (max-width: 640px) {
                    textarea {
                        font-size: 16px !important; /* Prevents zoom on focus in iOS */
                    }
                }
                
                /* Smooth scrolling for messages container */
                .scroll-smooth {
                    scroll-behavior: smooth;
                }
            `}</style>
        </div>
    );
};

export default Chat;