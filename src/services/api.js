import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const chatAPI = {
    sendMessage: async (message, chatId = null) => {
        const response = await api.post('/chat/message', { message, chatId });
        return response.data;
    },
    getHistory: async () => {
        const response = await api.get('/chat/history');
        return response.data;
    },
    getChat: async (chatId) => {
        const response = await api.get(`/chat/${chatId}`);
        return response.data;
    },
    deleteChat: async (chatId) => {
        const response = await api.delete(`/chat/${chatId}`);
        return response.data;
    }
};

export const adminAPI = {
    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    updateUser: async (userId, data) => {
        const response = await api.put(`/admin/users/${userId}`, data);
        return response.data;
    },
    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    }
};

export default api;