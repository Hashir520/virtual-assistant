import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { 
    FiMessageSquare, FiHome, FiMenu, FiX, FiLogOut, FiUser, 
    FiSettings, FiShield, FiCpu, FiClock, FiStar, FiTrash2,
    FiPlus, FiChevronRight, FiActivity
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, setIsOpen, chats, setChats, onSelectChat }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [hoveredChat, setHoveredChat] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchChats();
        }
    }, [isOpen]);

    const fetchChats = async () => {
        setLoading(true);
        try {
            const response = await chatAPI.getHistory();
            setChats(response.chats);
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = () => {
        navigate('/chat');
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
        toast.success('New chat started');
    };

    const formatDate = (date) => {
        const chatDate = new Date(date);
        const now = new Date();
        const diffDays = Math.floor((now - chatDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return chatDate.toLocaleDateString();
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    };

    const navItems = [
        { path: '/', icon: FiHome, label: 'Dashboard', color: 'text-blue-400' },
        ...(user?.role === 'admin' ? [{ path: '/admin', icon: FiShield, label: 'Admin Panel', color: 'text-purple-400' }] : []),
        { path: '/settings', icon: FiSettings, label: 'Settings', color: 'text-gray-400' }
    ];

    return (
        <>
            {/* Overlay with blur effect */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}
            
            {/* Sidebar Container */}
            <div className={`
                fixed top-0 left-0 h-full z-30 
                transform transition-all duration-500 ease-in-out 
                md:translate-x-0 md:relative
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Main Sidebar */}
                <div className="w-80 h-full bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-r border-white/10 shadow-2xl flex flex-col">
                    
                    {/* Header Section */}
                    <div className="relative p-5 border-b border-white/10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between relative">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <FiCpu className="text-white text-xl" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                        AVA
                                    </h1>
                                    <p className="text-xs text-white/50">Virtual Assistant</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="md:hidden text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                    </div>

                    {/* User Profile Section */}
                    <div className="p-5 border-b border-white/10">
                        <div className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                                    <span className="text-white font-bold text-lg">
                                        {getInitials(user?.name)}
                                    </span>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white truncate">{user?.name || 'User'}</p>
                                <p className="text-xs text-white/40 truncate">{user?.email || 'user@example.com'}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <FiActivity size={10} className="text-emerald-500" />
                                    <span className="text-[10px] text-white/30">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* New Chat Button */}
                    <div className="p-5 pb-2">
                        <button 
                            onClick={handleNewChat}
                            className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-500/25"
                        >
                            <FiPlus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>New Chat</span>
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <div className="px-4 py-2">
                        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3 mb-2">
                            MAIN MENU
                        </p>
                        <div className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link to={item.path} key={item.path}>
                                        <div className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer
                                            ${isActive 
                                                ? 'bg-white/10 text-white shadow-sm' 
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                            }
                                        `}>
                                            <Icon size={18} className={isActive ? item.color : 'text-inherit'} />
                                            <span className="text-sm font-medium">{item.label}</span>
                                            {isActive && (
                                                <FiChevronRight size={14} className="ml-auto text-white/40" />
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Chat History Section */}
                    <div className="flex-1 overflow-y-auto min-h-0 px-4 py-2">
                        <div className="flex items-center justify-between mb-3 px-3">
                            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                                CHAT HISTORY
                            </p>
                            {chats && chats.length > 0 && (
                                <span className="text-[10px] text-white/30">
                                    {chats.length} chats
                                </span>
                            )}
                        </div>
                        
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400/30 border-t-blue-500"></div>
                                </div>
                            </div>
                        ) : chats?.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                    <FiMessageSquare size={20} className="text-white/20" />
                                </div>
                                <p className="text-xs text-white/30">No chats yet</p>
                                <p className="text-[10px] text-white/20 mt-1">Start a new conversation</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {chats?.map((chat, index) => (
                                    <div
                                        key={chat._id}
                                        onClick={() => {
                                            onSelectChat(chat._id);
                                            navigate(`/chat/${chat._id}`);
                                            if (window.innerWidth < 768) {
                                                setIsOpen(false);
                                            }
                                        }}
                                        onMouseEnter={() => setHoveredChat(chat._id)}
                                        onMouseLeave={() => setHoveredChat(null)}
                                        className={`
                                            group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer 
                                            transition-all duration-300
                                            ${location.pathname === `/chat/${chat._id}` 
                                                ? 'bg-white/10 shadow-sm' 
                                                : 'hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <div className={`
                                            w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                                            ${location.pathname === `/chat/${chat._id}` 
                                                ? 'bg-blue-500/20 text-blue-400' 
                                                : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/60'
                                            }
                                        `}>
                                            <FiMessageSquare size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white/80 truncate font-medium">
                                                {chat.title || 'New Conversation'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <FiClock size={10} className="text-white/30" />
                                                <p className="text-[10px] text-white/30">
                                                    {formatDate(chat.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        {hoveredChat === chat._id && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Add delete functionality here
                                                    toast('Delete chat?', { icon: '🗑️' });
                                                }}
                                                className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all duration-300"
                                            >
                                                <FiTrash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Section - Only Version Info */}
                    <div className="p-5 border-t border-white/10 mt-auto">
                        {/* Version Info */}
                        <div className="text-center">
                            <p className="text-[10px] text-white/20">
                                Version 2.0.0 • © 2024 AVA AI
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar; 