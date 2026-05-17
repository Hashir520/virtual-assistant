import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    FiMail, FiLock, FiLogIn, FiCpu, FiArrowRight, 
    FiEye, FiEyeOff
} from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(email, password);
        setLoading(false);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen relative">
            {/* Background Image for ALL devices */}
            <div 
                className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.pexels.com/photos/8721342/pexels-photo-8721342.jpeg?auto=compress&cs=tinysrgb&w=1600")',
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50"></div>
            </div>

            {/* Mobile Header */}
            <div className="relative z-20 lg:hidden bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <FiCpu className="text-white text-sm" />
                        </div>
                        <span className="font-bold text-white">AVA Assistant</span>
                    </div>
                    <div className="text-white text-xs bg-white/20 px-3 py-1 rounded-full">
                        Sign In
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
                {/* Left Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 lg:py-8">
                    <div className="w-full max-w-md">
                        {/* Logo Desktop */}
                        <div className="hidden lg:flex items-center justify-center mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <FiCpu className="text-white text-xl" />
                                </div>
                                <span className="text-xl font-bold text-white">
                                    AVA Assistant
                                </span>
                            </div>
                        </div>
                        
                        {/* Glassmorphism Card */}
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8">
                            <div className="text-center lg:text-left mb-6">
                                <h1 className="text-2xl text-center sm:text-3xl font-bold text-gray-900 mb-2">
                                    Welcome back
                                </h1>
                                <p className="text-gray-500 text-center text-sm sm:text-base">
                                    Sign in to continue with AVA
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiMail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-base"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiLock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-base"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? 
                                                <FiEyeOff className="h-5 w-5 text-gray-400" /> : 
                                                <FiEye className="h-5 w-5 text-gray-400" />
                                            }
                                        </button>
                                    </div>
                                    <div className="text-right mt-1">
                                        <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 text-base"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign in
                                            <FiLogIn className="h-5 w-5" />
                                        </>
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500">New to AVA?</span>
                                    </div>
                                </div>

                                {/* Register Link */}
                                <div className="text-center pb-2">
                                    <Link 
                                        to="/register" 
                                        className="inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700 transition-colors group text-sm sm:text-base"
                                    >
                                        Create a new account
                                        <FiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Side - Desktop Only */}
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
                            Welcome to AVA
                        </h1>
                        <p className="text-xl text-blue-200">
                            Your intelligent virtual assistant
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile AI Info Card */}
            <div className="lg:hidden relative z-10 mx-4 mb-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <FiCpu size={16} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-white text-xs font-medium">AVA AI Ready</span>
                            </div>
                            <p className="text-white/70 text-xs">Your virtual assistant</p>
                        </div>
                        <div className="text-white/50 text-[10px]">
                            v1.0
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;