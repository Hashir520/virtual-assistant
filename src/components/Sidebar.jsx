import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { FiMessageSquare, FiHome, FiMenu, FiX, FiLogOut, FiUser, FiSettings, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, setIsOpen, chats, setChats, onSelectChat }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNewChat = () => {
        navigate('/chat');
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-72 z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">AVA</h1>
                        <p className="text-xs text-gray-400">Virtual Assistant</p>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="md:hidden text-gray-400 hover:text-white"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <FiUser size={20} />
                        </div>
                        <div>
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="p-4 space-y-2">
                    <button 
                        onClick={handleNewChat}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                        + New Chat
                    </button>
                    
                    <Link to="/">
                        <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${location.pathname === '/' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
                            <FiHome size={20} />
                            <span>Dashboard</span>
                        </div>
                    </Link>

                    {user?.role === 'admin' && (
                        <Link to="/admin">
                            <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${location.pathname === '/admin' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
                                <FiShield size={20} />
                                <span>Admin Panel</span>
                            </div>
                        </Link>
                    )}
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-3">CHAT HISTORY</p>
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                    ) : chats?.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No chats yet</p>
                    ) : (
                        <div className="space-y-1">
                            {chats?.map((chat) => (
                                <div
                                    key={chat._id}
                                    onClick={() => {
                                        onSelectChat(chat._id);
                                        navigate(`/chat/${chat._id}`);
                                        if (window.innerWidth < 768) {
                                            setIsOpen(false);
                                        }
                                    }}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                                >
                                    <FiMessageSquare size={16} className="text-gray-400" />
                                    <span className="text-sm truncate">{chat.title}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full p-2 rounded-lg hover:bg-gray-800"
                    >
                        <FiLogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;