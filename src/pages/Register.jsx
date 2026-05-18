import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    FiUser, FiMail, FiLock, FiUserPlus, FiCpu, 
    FiCheckCircle, FiMessageCircle, FiZap, FiShield,
    FiArrowRight, FiEye, FiEyeOff
} from 'react-icons/fi';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        setLoading(true);
        const success = await register(name, email, password);
        setLoading(false);
        if (success) {
            navigate('/');
        }
    };

    const features = [
        { icon: <FiMessageCircle className="text-blue-400" />, text: "24/7 Intelligent Assistance" },
        { icon: <FiZap className="text-yellow-400" />, text: "Instant AI-Powered Responses" },
        { icon: <FiShield className="text-green-400" />, text: "Enterprise-Grade Security" },
        { icon: <FiCheckCircle className="text-purple-400" />, text: "Free Forever Plan" }
    ];

    return (
        <div className="min-h-screen relative">
            {/* Background Image for ALL devices */}
            <div 
                className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1600")',
                }}
            >
                {/* Dark Overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/60"></div>
                
                {/* Gradient Overlay for modern look */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50"></div>
            </div>

            {/* Mobile Header */}
            <div className="relative z-20 lg:hidden bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <FiCpu className="text-white text-sm" />
                    </div>
                    <span className="font-bold text-white">AVA Assistant</span>
                </div>
                <div className="text-white text-xs bg-white/20 px-3 py-1 rounded-full">
                    AI Ready
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
                {/* Left Side - Form (Mobile pe full width with blur background) */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-6 lg:py-8">
                    <div className="w-full max-w-md">
                        {/* Logo for desktop */}
                     <div className="hidden lg:flex items-center justify-center w-full gap-2 mb-8">
    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
        <FiCpu className="text-white text-xl" />
    </div>

    <span className="text-xl font-bold text-white">
        AVA Assistant
    </span>
</div>
                        
                        {/* Glassmorphism Card */}
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-5 sm:p-6 border border-white/20">
    <div className="text-center lg:text-left mb-4">
        <h1 className="text-xl text-center sm:text-2xl font-bold text-white mb-1">
            Create an account
        </h1>
        <p className="text-blue-100 text-center text-xs sm:text-sm">
            Join thousands of users using AVA
        </p>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name Field */}
        <div>
            <label className="block text-xs font-medium text-blue-100 mb-1">
                Full name
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-4 w-4 text-blue-200" />
                </div>
                <input
                    type="text"
                    required
                    value={name}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm text-white placeholder:text-white/50"
                    placeholder="John Doe"
                />
            </div>
        </div>

        {/* Email Field */}
        <div>
            <label className="block text-xs font-medium text-blue-100 mb-1">
                Email address
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-4 w-4 text-blue-200" />
                </div>
                <input
                    type="email"
                    required
                    value={email}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm text-white placeholder:text-white/50"
                    placeholder="you@example.com"
                />
            </div>
        </div>

        {/* Password Field */}
        <div>
            <label className="block text-xs font-medium text-blue-100 mb-1">
                Password
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-4 w-4 text-blue-200" />
                </div>
                <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 pr-9 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm text-white placeholder:text-white/50"
                    placeholder="At least 6 characters"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    {showPassword ? 
                        <FiEyeOff className="h-4 w-4 text-blue-200 hover:text-white" /> : 
                        <FiEye className="h-4 w-4 text-blue-200 hover:text-white" />
                    }
                </button>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">Must be at least 6 characters</p>
        </div>

        {/* Confirm Password Field */}
        <div>
            <label className="block text-xs font-medium text-blue-100 mb-1">
                Confirm password
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-4 w-4 text-blue-200" />
                </div>
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-9 pr-9 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm text-white placeholder:text-white/50"
                    placeholder="Confirm your password"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    {showConfirmPassword ? 
                        <FiEyeOff className="h-4 w-4 text-blue-200 hover:text-white" /> : 
                        <FiEye className="h-4 w-4 text-blue-200 hover:text-white" />
                    }
                </button>
            </div>
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 text-sm"
        >
            {loading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating account...
                </>
            ) : (
                <>
                    Get Started
                    <FiArrowRight className="h-4 w-4" />
                </>
            )}
        </button>

        {/* Divider */}
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-transparent text-blue-100">Already have an account?</span>
            </div>
        </div>

        {/* Login Link */}
        <div className="text-center pb-1">
            <Link 
                to="/login" 
                className="inline-flex items-center gap-1 text-blue-300 font-medium hover:text-white transition-colors group text-sm"
            >
                Sign In 
                <FiArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    </form>
</div>
                    </div>
                </div>

                {/* Right Side  - Desktop Only enhanced (AI Assistant Section) */}
                <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
                    <div className="text-center text-white p-8">
                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-blue-400" style={{ width: '160px', height: '160px', left: '-20px', top: '-20px' }}></div>
                            <div className="absolute inset-0 rounded-full animate-pulse opacity-30 bg-indigo-400" style={{ width: '150px', height: '150px', left: '-15px', top: '-15px' }}></div>
                            
                            <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500 mx-auto">
                                <FiCpu size={56} className="text-white animate-pulse" />
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                            AVA Virtual Assistant
                        </h1>
                        <p className="text-xl text-blue-200 mb-6">
                            Your intelligent AI companion
                        </p>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-8 max-w-sm mx-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm text-blue-200">AI Assistant is online</span>
                            </div>
                            <div className="flex items-center gap-1 mt-2 justify-center">
                                <span className="text-white">"</span>
                                <div className="typing-text text-white font-medium">
                                    Ready to assist you 24/7
                                </div>
                                <span className="text-white">"</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                            {features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-3 animate-slide-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="text-lg">{feature.icon}</div>
                                    <span className="text-xs text-white">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile AI Info Card - Floating at bottom */}
            <div className="lg:hidden relative z-10 mx-4 mb-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <FiCpu size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-white text-xs font-medium">AVA AI Assistant</span>
                            </div>
                            <p className="text-white/80 text-xs mt-1">Ready to help you 24/7</p>
                        </div>
                        <div className="text-white/60 text-xs">
                            v1.0
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-slide-in {
                    animation: slide-in 0.5s ease-out forwards;
                    opacity: 0;
                }
                
                .typing-text {
                    overflow: hidden;
                    border-right: 2px solid white;
                    white-space: nowrap;
                    animation: typing 3s steps(40, end) infinite, blink-caret 0.75s step-end infinite;
                }
                
                @keyframes typing {
                    0%, 20% { width: 0; }
                    30%, 70% { width: 100%; }
                    80%, 100% { width: 0; }
                }
                
                @keyframes blink-caret {
                    from, to { border-color: transparent; }
                    50% { border-color: white; }
                }
            `}</style>
        </div>
    );
};

export default Register;