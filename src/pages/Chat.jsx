import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import {
    FiMenu,
    FiSend,
    FiMoreVertical,
    FiPaperclip,
    FiMic,
    FiSmile,
    FiHelpCircle,
    FiInfo
} from 'react-icons/fi';
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
    }, [messages, isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
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
            hello: [
                'Hello! 👋 How can I make your day better?',
                'Hi there! 🌟 Ready to help you!',
                'Greetings! 💫 What brings you here today?'
            ],
            how: [
                "I'm absolutely fantastic! ✨ Thanks for asking!",
                'Doing great! 🚀 Ready to tackle any challenge you throw my way!'
            ],
            help: [
                "I'm your personal AI assistant! 🎯 I can help with coding, research, tasks, and much more.",
                'Consider me your digital sidekick! 💪 Ask me anything.'
            ],
            joke: [
                'Why do programmers prefer dark mode? 😂 Because light attracts bugs!',
                "What's a computer's favorite beat? 🎵 Micro-soft!"
            ],
            thanks: [
                "You're welcome! 🌈",
                'Happy to help anytime! 💫'
            ],
            bye: [
                'Goodbye! 👋 Have a wonderful day!',
                'See you later! 🌟'
            ]
        };

        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return value[Math.floor(Math.random() * value.length)];
            }
        }

        return `Thanks for your message! 💭 "${message.substring(
            0,
            50
        )}" - Let me think about that and get back to you with the best possible answer! 🚀`;
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim()) return;

        const currentMessage = inputMessage;

        const userMessage = {
            role: 'user',
            content: currentMessage,
            timestamp: new Date()
        };

        setMessages((prev) => [...prev, userMessage]);

        setInputMessage('');
        setIsTyping(true);

        try {
            const response = await chatAPI.sendMessage(
                currentMessage,
                chatId
            );

            const assistantMessage = {
                role: 'assistant',
                content: response.response,
                timestamp: new Date()
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (!chatId && response.chatId) {
                navigate(`/chat/${response.chatId}`);
            }
        } catch (error) {
            console.log('Using mock response');

            const assistantMessage = {
                role: 'assistant',
                content: getMockResponse(currentMessage),
                timestamp: new Date()
            };

            setMessages((prev) => [...prev, assistantMessage]);
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
        <div className="h-[100dvh] flex overflow-hidden relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">

            {/* Background */}
            <div className="fixed inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage:
                            'url("https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1600")'
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-purple-900/85" />

                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />
            </div>

            {/* Sidebar */}
            <div
                className={`
                    fixed inset-y-0 left-0 z-30
                    transform transition-all duration-500 ease-in-out
                    lg:relative lg:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
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

            {/* Main Chat */}
            <div className="flex-1 flex flex-col overflow-hidden relative z-10">

                {/* Header */}
                <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
                    <div className="px-4 sm:px-6 py-4 flex items-center justify-between">

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-white p-2 rounded-xl hover:bg-white/10"
                            >
                                <FiMenu size={22} />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-bold">
                                            A
                                        </span>
                                    </div>

                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border border-white/30 animate-pulse" />
                                </div>

                                <div>
                                    <h1 className="text-white font-semibold">
                                        AVA Assistant
                                    </h1>

                                    <p className="text-white/50 text-xs">
                                        AI Ready • 24/7 Online
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10">
                                <FiHelpCircle size={18} />
                            </button>

                            <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10">
                                <FiInfo size={18} />
                            </button>

                            <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10">
                                <FiMoreVertical size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400/30 border-t-blue-500" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">

                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-2xl opacity-60 animate-pulse" />

                                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                    <span className="text-4xl">✨</span>
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-3">
                                Welcome to AVA
                            </h2>

                            <p className="text-white/60 max-w-md mb-8">
                                Your intelligent virtual assistant,
                                ready to help you 24/7
                            </p>

                            <div className="flex flex-wrap gap-3 justify-center">
                                {[
                                    'What can you do?',
                                    'Tell me a joke',
                                    "What's the time?",
                                    'Help me with coding'
                                ].map((text) => (
                                    <button
                                        key={text}
                                        onClick={() => {
                                            setInputMessage(text);

                                            setTimeout(() => {
                                                inputRef.current?.focus();
                                            }, 100);
                                        }}
                                        className="px-5 py-2.5 bg-white/10 rounded-full text-white/80 hover:bg-white/20 transition-all"
                                    >
                                        {text}
                                    </button>
                                ))}
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

                {/* Input Area */}
                <div className="sticky bottom-0 z-20 bg-black/20 backdrop-blur-xl border-t border-white/10">
                    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">

                        <form
                            onSubmit={sendMessage}
                            className="flex items-end gap-2 sm:gap-3"
                        >

                            {/* Input */}
                            <div className="flex-1 relative">

                                {/* Left Icons */}
                                <div className="absolute left-2 sm:left-3 bottom-3 flex items-center gap-1">

                                    <button
                                        type="button"
                                        className="p-1.5 text-white/50 hover:text-white transition-all rounded-lg"
                                    >
                                        <FiPaperclip size={17} />
                                    </button>

                                    <button
                                        type="button"
                                        className="hidden sm:flex p-1.5 text-white/50 hover:text-white transition-all rounded-lg"
                                    >
                                        <FiSmile size={17} />
                                    </button>
                                </div>

                                {/* Textarea */}
                                <textarea
                                    ref={inputRef}
                                    rows={1}
                                    value={inputMessage}
                                    disabled={isTyping}
                                    placeholder="Type your message..."
                                    onChange={(e) =>
                                        setInputMessage(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === 'Enter' &&
                                            !e.shiftKey
                                        ) {
                                            e.preventDefault();
                                            sendMessage(e);
                                        }
                                    }}
                                    className="
                                        w-full
                                        min-h-[52px]
                                        max-h-[140px]
                                        resize-none
                                        overflow-y-auto
                                        rounded-2xl
                                        bg-white/10
                                        border border-white/10
                                        text-white
                                        placeholder-white/40
                                        pl-20 sm:pl-24
                                        pr-14
                                        py-3
                                        text-sm sm:text-base
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-blue-500/30
                                        focus:border-blue-500/40
                                        backdrop-blur-lg
                                    "
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';

                                        e.target.style.height =
                                            Math.min(
                                                e.target.scrollHeight,
                                                140
                                            ) + 'px';
                                    }}
                                />

                                {/* Mic */}
                                <button
                                    type="button"
                                    className="
                                        absolute
                                        right-3
                                        bottom-2.5
                                        p-2
                                        rounded-xl
                                        text-white/50
                                        hover:text-white
                                        hover:bg-white/10
                                        transition-all
                                    "
                                >
                                    <FiMic size={18} />
                                </button>
                            </div>

                            {/* Send */}
                            <button
                                type="submit"
                                disabled={
                                    !inputMessage.trim() || isTyping
                                }
                                className="
                                    h-[52px]
                                    min-w-[52px]
                                    px-4
                                    rounded-2xl
                                    flex
                                    items-center
                                    justify-center
                                    bg-gradient-to-r
                                    from-blue-600
                                    to-indigo-600
                                    text-white
                                    shadow-lg
                                    transition-all
                                    hover:scale-105
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >
                                <FiSend size={18} />
                            </button>
                        </form>

                        <p className="text-white/30 text-[11px] sm:text-xs text-center mt-2">
                            Press Enter to send • Shift + Enter for new line
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;