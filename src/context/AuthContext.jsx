// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [token, setToken] = useState(localStorage.getItem('token'));

//     // Set axios default header
//     if (token) {
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }

//     useEffect(() => {
//         if (token) {
//             fetchUser();
//         } else {
//             setLoading(false);
//         }
//     }, [token]);

//     const fetchUser = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/auth/me');
//             setUser(response.data.user);
//         } catch (error) {
//             console.error('Fetch user error:', error);
//             localStorage.removeItem('token');
//             setToken(null);
//             delete axios.defaults.headers.common['Authorization'];
//         } finally {
//             setLoading(false);
//         }
//     };

//     const login = async (email, password) => {
//         try {
//             const response = await axios.post('http://localhost:5000/api/auth/login', {
//                 email,
//                 password
//             });
            
//             const { token, user } = response.data;
//             localStorage.setItem('token', token);
//             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//             setToken(token);
//             setUser(user);
//             toast.success('Login successful!');
//             return true;
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Login failed');
//             return false;
//         }
//     };

//     const register = async (name, email, password) => {
//         try {
//             const response = await axios.post('http://localhost:5000/api/auth/register', {
//                 name,
//                 email,
//                 password
//             });
            
//             const { token, user } = response.data;
//             localStorage.setItem('token', token);
//             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//             setToken(token);
//             setUser(user);
//             toast.success('Registration successful!');
//             return true;
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Registration failed');
//             return false;
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         delete axios.defaults.headers.common['Authorization'];
//         setToken(null);
//         setUser(null);
//         toast.success('Logged out successfully');
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Dummy Login - Accepts any email/password
    const login = async (email, password) => {
        try {
            // Using JSONPlaceholder for dummy data
            const response = await axios.get('https://jsonplaceholder.typicode.com/users/1');
            
            // Create dummy user data
            const dummyUser = {
                id: response.data.id,
                name: response.data.name,
                email: email,
                role: email.includes('admin') ? 'admin' : 'user'
            };
            
            const dummyToken = 'dummy_jwt_token_' + Date.now();
            
            localStorage.setItem('token', dummyToken);
            localStorage.setItem('user', JSON.stringify(dummyUser));
            setToken(dummyToken);
            setUser(dummyUser);
            
            toast.success(`Welcome ${dummyUser.name}!`);
            return true;
        } catch (error) {
            toast.error('Login failed. Please try again.');
            return false;
        }
    };

    // Dummy Register - Always successful
    const register = async (name, email, password) => {
        try {
            // Create dummy user
            const dummyUser = {
                id: Date.now(),
                name: name,
                email: email,
                role: 'user'
            };
            
            const dummyToken = 'dummy_jwt_token_' + Date.now();
            
            localStorage.setItem('token', dummyToken);
            localStorage.setItem('user', JSON.stringify(dummyUser));
            setToken(dummyToken);
            setUser(dummyUser);
            
            toast.success('Registration successful!');
            return true;
        } catch (error) {
            toast.error('Registration failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};