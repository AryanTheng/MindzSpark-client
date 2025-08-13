import React, { useState, useEffect } from 'react';
import { FaBell, FaPlus, FaEdit, FaTrash, FaEye, FaTimes, FaUsers, FaCalendar, FaTag } from 'react-icons/fa';
import { MdNotifications, MdSend, MdVisibility } from 'react-icons/md';
import { useNotifications } from '../provider/NotificationProvider';
import toast from 'react-hot-toast';

const NotificationManager = () => {
    const {
        notifications,
        loading,
        createNotification,
        updateNotification,
        deleteNotification,
        getNotificationStats,
        fetchAllNotifications
    } = useNotifications();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [editingNotification, setEditingNotification] = useState(null);
    const [stats, setStats] = useState({
        totalNotifications: 0,
        activeNotifications: 0,
        totalViewers: 0,
        sentToday: 0
    });

    const [newNotification, setNewNotification] = useState({
        type: 'system',
        title: '',
        message: '',
        fullMessage: '',
        target: 'all',
        priority: 'medium',
        status: 'active',
        scheduledDate: ''
    });

    const notificationTypes = [
        { value: 'system', label: 'System', color: 'bg-blue-100 text-blue-800' },
        { value: 'order', label: 'Order', color: 'bg-green-100 text-green-800' },
        { value: 'promo', label: 'Promotion', color: 'bg-purple-100 text-purple-800' },
        { value: 'alert', label: 'Alert', color: 'bg-red-100 text-red-800' }
    ];

    const priorityLevels = [
        { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
        { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
    ];

    // Load stats on component mount
    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const statsData = await getNotificationStats();
            setStats(statsData);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleCreateNotification = async () => {
        if (newNotification.title && newNotification.message) {
            try {
                await createNotification(newNotification);
                await loadStats(); // Refresh stats
                setNewNotification({
                    type: 'system',
                    title: '',
                    message: '',
                    fullMessage: '',
                    target: 'all',
                    priority: 'medium',
                    status: 'active',
                    scheduledDate: ''
                });
                setShowCreateModal(false);
            } catch (error) {
                // Error is already handled in the provider
            }
        } else {
            toast.error('Please fill in all required fields');
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await deleteNotification(id);
            await loadStats(); // Refresh stats
        } catch (error) {
            // Error is already handled in the provider
        }
    };

    const handleViewNotification = (notification) => {
        setSelectedNotification(notification);
        setShowViewModal(true);
    };

    const handleEditNotification = (notification) => {
        setEditingNotification(notification);
        setNewNotification({
            type: notification.type,
            title: notification.title,
            message: notification.message,
            fullMessage: notification.fullMessage,
            target: notification.target,
            priority: notification.priority,
            status: notification.status,
            scheduledDate: notification.scheduledDate || ''
        });
        setShowCreateModal(true);
    };

    const handleUpdateNotification = async () => {
        if (editingNotification && newNotification.title && newNotification.message) {
            try {
                await updateNotification(editingNotification._id, newNotification);
                await loadStats(); // Refresh stats
                setEditingNotification(null);
                setNewNotification({
                    type: 'system',
                    title: '',
                    message: '',
                    fullMessage: '',
                    target: 'all',
                    priority: 'medium',
                    status: 'active',
                    scheduledDate: ''
                });
                setShowCreateModal(false);
            } catch (error) {
                // Error is already handled in the provider
            }
        } else {
            toast.error('Please fill in all required fields');
        }
    };

    const getNotificationTypeColor = (type) => {
        const typeObj = notificationTypes.find(t => t.value === type);
        return typeObj ? typeObj.color : 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const priorityObj = priorityLevels.find(p => p.value === priority);
        return priorityObj ? priorityObj.color : 'bg-gray-100 text-gray-800';
    };

    const formatTime = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        if (diffInHours < 48) return '1 day ago';
        return `${Math.floor(diffInHours / 24)} days ago`;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Notification Management</h1>
                        <p className="text-gray-600">Create and manage notifications for all users</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <FaPlus size={16} />
                        <span>Create Notification</span>
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <FaBell className="text-blue-600" size={24} />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Total Notifications</p>
                                <p className="text-xl font-bold text-gray-800">{stats.totalNotifications}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <MdNotifications className="text-green-600" size={24} />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Active Notifications</p>
                                <p className="text-xl font-bold text-gray-800">{stats.activeNotifications}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <MdVisibility className="text-purple-600" size={24} />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Total Viewers</p>
                                <p className="text-xl font-bold text-gray-800">{stats.totalViewers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <MdSend className="text-orange-600" size={24} />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Sent Today</p>
                                <p className="text-xl font-bold text-gray-800">{stats.sentToday}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-800">All Notifications</h2>
                    </div>
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                <p className="mt-2 text-gray-600">Loading notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <FaBell size={48} className="mx-auto mb-2 text-gray-300" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Notification
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Priority
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Views
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {notifications.map((notification) => (
                                        <tr key={notification._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                                    <p className="text-sm text-gray-500">{notification.message}</p>
                                                    <p className="text-xs text-gray-400">{formatTime(notification.createdAt)}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getNotificationTypeColor(notification.type)}`}>
                                                    {notificationTypes.find(t => t.value === notification.type)?.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                                                    {notification.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    notification.status === 'active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {notification.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    <p className="font-medium">{notification.viewedBy.length} viewers</p>
                                                    <p className="text-xs text-gray-500">{notification.readCount} reads</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewNotification(notification)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="View Details"
                                                    >
                                                        <FaEye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditNotification(notification)}
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Edit"
                                                    >
                                                        <FaEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteNotification(notification._id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Delete"
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {editingNotification ? 'Edit Notification' : 'Create New Notification'}
                            </h3>
                            <button 
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setEditingNotification(null);
                                    setNewNotification({
                                        type: 'system',
                                        title: '',
                                        message: '',
                                        fullMessage: '',
                                        target: 'all',
                                        priority: 'medium',
                                        status: 'active',
                                        scheduledDate: ''
                                    });
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notification Type
                                    </label>
                                    <select
                                        value={newNotification.type}
                                        onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        {notificationTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority Level
                                    </label>
                                    <select
                                        value={newNotification.priority}
                                        onChange={(e) => setNewNotification({...newNotification, priority: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        {priorityLevels.map(priority => (
                                            <option key={priority.value} value={priority.value}>
                                                {priority.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={newNotification.title}
                                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                                    placeholder="Enter notification title"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Short Message *
                                </label>
                                <textarea
                                    value={newNotification.message}
                                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                                    placeholder="Enter short message (displayed in notification list)"
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Message
                                </label>
                                <textarea
                                    value={newNotification.fullMessage}
                                    onChange={(e) => setNewNotification({...newNotification, fullMessage: e.target.value})}
                                    placeholder="Enter full message (displayed when user clicks on notification)"
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Target Audience
                                    </label>
                                    <select
                                        value={newNotification.target}
                                        onChange={(e) => setNewNotification({...newNotification, target: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="all">All Users</option>
                                        <option value="new_users">New Users</option>
                                        <option value="active_users">Active Users</option>
                                        <option value="premium_users">Premium Users</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={newNotification.status}
                                        onChange={(e) => setNewNotification({...newNotification, status: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="scheduled">Scheduled</option>
                                    </select>
                                </div>
                            </div>

                            {newNotification.status === 'scheduled' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Schedule Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={newNotification.scheduledDate}
                                        onChange={(e) => setNewNotification({...newNotification, scheduledDate: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={editingNotification ? handleUpdateNotification : handleCreateNotification}
                                disabled={loading}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : (editingNotification ? 'Update Notification' : 'Create Notification')}
                            </button>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setEditingNotification(null);
                                    setNewNotification({
                                        type: 'system',
                                        title: '',
                                        message: '',
                                        fullMessage: '',
                                        target: 'all',
                                        priority: 'medium',
                                        status: 'active',
                                        scheduledDate: ''
                                    });
                                }}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Notification Modal */}
            {showViewModal && selectedNotification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Notification Details</h3>
                            <button 
                                onClick={() => setShowViewModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getNotificationTypeColor(selectedNotification.type)}`}>
                                    {notificationTypes.find(t => t.value === selectedNotification.type)?.label}
                                </span>
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(selectedNotification.priority)}`}>
                                    {selectedNotification.priority} Priority
                                </span>
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                    selectedNotification.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {selectedNotification.status}
                                </span>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">{selectedNotification.title}</h4>
                                <p className="text-gray-600 mb-4">{selectedNotification.message}</p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-medium text-gray-800 mb-2">Full Message:</h5>
                                    <p className="text-gray-700">{selectedNotification.fullMessage}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Created:</p>
                                    <p className="font-medium">{formatTime(selectedNotification.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Target:</p>
                                    <p className="font-medium capitalize">{selectedNotification.target.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Viewers:</p>
                                    <p className="font-medium">{selectedNotification.viewedBy.length} users</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Read Count:</p>
                                    <p className="font-medium">{selectedNotification.readCount} reads</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Created By:</p>
                                    <p className="font-medium">{selectedNotification.createdBy}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    handleEditNotification(selectedNotification);
                                    setShowViewModal(false);
                                }}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Edit Notification
                            </button>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationManager; 