import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMessageSquare, FiUsers, FiDatabase, FiTrendingUp, FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        // Set greeting based on time
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Evening');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Morning');
    }, []);

    const features = [
        {
            icon: <FiMessageSquare className="w-8 h-8 text-blue-600" />,
            title: "Chat with AVA",
            description: "Start a conversation with your virtual assistant",
            action: () => navigate('/chat'),
            color: "bg-blue-50 hover:bg-blue-100",
            border: "border-blue-200"
        },
        {
            icon: <FiUsers className="w-8 h-8 text-green-600" />,
            title: "User Management",
            description: "Manage your account and preferences",
            action: () => {},
            color: "bg-green-50 hover:bg-green-100",
            border: "border-green-200"
        },
        {
            icon: <FiDatabase className="w-8 h-8 text-purple-600" />,
            title: "Chat History",
            description: "View all your previous conversations",
            action: () => navigate('/chat'),
            color: "bg-purple-50 hover:bg-purple-100",
            border: "border-purple-200"
        },
        {
            icon: <FiTrendingUp className="w-8 h-8 text-orange-600" />,
            title: "Analytics",
            description: "Track your usage and insights",
            action: () => {},
            color: "bg-orange-50 hover:bg-orange-100",
            border: "border-orange-200"
        }
    ];

    // Sample data for stats
    const stats = [
        { title: "Total Chats", value: "24", change: "+12%", icon: <FiMessageSquare className="text-blue-500" /> },
        { title: "Messages Sent", value: "1,247", change: "+8%", icon: <FiDatabase className="text-green-500" /> },
        { title: "Active Days", value: "15", change: "+3 days", icon: <FiTrendingUp className="text-purple-500" /> },
        { title: "Response Rate", value: "98%", change: "+2%", icon: <FiUsers className="text-orange-500" /> }
    ];

    return (
        <div className="min-h-screen relative">
            {/* Background Image - AI Themed */}
            <div 
                className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.pexels.com/photos/8721342/pexels-photo-8721342.jpeg?auto=compress&cs=tinysrgb&w=1600")',
                }}
            >
                {/* Dark Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-indigo-900/85"></div>
                
                {/* Animated Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>
                
                {/* Floating Animated Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white/5 animate-pulse"
                            style={{
                                width: Math.random() * 6 + 2 + 'px',
                                height: Math.random() * 6 + 2 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 5 + 's',
                                animationDuration: Math.random() * 4 + 2 + 's'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-xl">A</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">
                                        {greeting}, {user?.name?.split(' ')[0]}!
                                    </h1>
                                    <p className="text-white/70 text-sm hidden sm:block">
                                        Your Automated virtual assistant is ready to help
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative">
                                    <FiBell className="text-white text-xl" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                                <button 
                                    onClick={logout}
                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    <FiLogOut className="text-white text-xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div 
                                key={index}
                                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        {stat.icon}
                                    </div>
                                    <span className="text-green-400 text-xs font-medium bg-green-400/20 px-2 py-1 rounded-full">
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-white/70 text-sm font-medium">{stat.title}</h3>
                                <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Welcome Banner */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 shadow-xl">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <span className="text-4xl">🤖</span>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                            How can I help you today?
                                        </h2>
                                    </div>
                                    <p className="text-blue-100 mt-2">
                                        Ask me anything - from general questions to specific tasks
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/chat')}
                                    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
                                >
                                    Start a Conversation →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Title */}
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                            Quick Actions
                        </h2>
                        <p className="text-white/60 text-sm mt-1">Get started with these features</p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                onClick={feature.action}
                                className={`${feature.color} backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl border ${feature.border} bg-white/90`}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="p-3 rounded-full bg-white shadow-md">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mt-4">{feature.title}</h3>
                                    <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* AI Tip of the Day */}
                    {/* <div className="mt-8">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-yellow-400 text-xl">💡</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-white/80 text-sm">
                                        <span className="text-yellow-400 font-medium">AI Tip:</span> You can ask me to summarize long texts, 
                                        help with coding, answer questions, and much more!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;