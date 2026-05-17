import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { 
    FiUsers, 
    FiMessageSquare, 
    FiBarChart2, 
    FiUserCheck, 
    FiUserX, 
    FiShield,
    FiTrash2,
    FiEdit2,
    FiX,
    FiCheck,
    FiRefreshCw,
    FiActivity,
    FiClock,
    FiMail,
    FiCalendar
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminPanel = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ role: 'user', isActive: true });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, statsRes] = await Promise.all([
                adminAPI.getUsers(),
                adminAPI.getStats()
            ]);
            setUsers(usersRes.users);
            setStats(statsRes.stats);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (userId) => {
        try {
            await adminAPI.updateUser(userId, editForm);
            toast.success('User updated successfully');
            fetchData();
            setShowEditModal(false);
            setSelectedUser(null);
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await adminAPI.deleteUser(userId);
                toast.success('User deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditForm({ role: user.role, isActive: user.isActive });
        setShowEditModal(true);
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className={`${color} p-3 rounded-full`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <FiShield className="text-blue-600" />
                                Admin Panel
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage users, monitor system activity, and control settings
                            </p>
                        </div>
                        <button
                            onClick={fetchData}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <FiRefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistics Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">System Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard 
                            title="Total Users" 
                            value={stats?.totalUsers || 0} 
                            icon={<FiUsers size={24} className="text-blue-600" />}
                            color="bg-blue-100"
                        />
                        <StatCard 
                            title="Total Chats" 
                            value={stats?.totalChats || 0} 
                            icon={<FiMessageSquare size={24} className="text-green-600" />}
                            color="bg-green-100"
                        />
                        <StatCard 
                            title="Total Messages" 
                            value={stats?.totalMessages || 0} 
                            icon={<FiActivity size={24} className="text-purple-600" />}
                            color="bg-purple-100"
                        />
                        <StatCard 
                            title="Active Users" 
                            value={users.filter(u => u.isActive).length || 0} 
                            icon={<FiUserCheck size={24} className="text-orange-600" />}
                            color="bg-orange-100"
                        />
                    </div>
                </div>

                {/* Recent Users Section */}
                {stats?.recentUsers && stats.recentUsers.length > 0 && (
                    <div className="mb-8 bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
                        </div>
                        <div className="divide-y">
                            {stats.recentUsers.map((recentUser) => (
                                <div key={recentUser._id} className="px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FiUsers className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{recentUser.name}</p>
                                            <p className="text-sm text-gray-500">{recentUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <FiCalendar size={14} />
                                            <span>{new Date(recentUser.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
                            <div className="text-sm text-gray-500">
                                Total: {users.length} users
                            </div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {u.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <FiMail size={14} />
                                                {u.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                u.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {u.role === 'admin' ? <FiShield size={12} className="mr-1" /> : null}
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                u.isActive 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {u.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <FiClock size={12} />
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(u)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                    title="Edit User"
                                                >
                                                    <FiEdit2 size={18} />
                                                </button>
                                                {u.email !== user?.email && (
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {users.length === 0 && (
                        <div className="text-center py-12">
                            <FiUsers size={48} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Edit User: {selectedUser.name}
                            </h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={editForm.isActive}
                                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 p-6 border-t bg-gray-50">
                            <button
                                onClick={() => handleUpdateUser(selectedUser._id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FiCheck size={16} />
                                Save Changes
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;