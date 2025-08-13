import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const user = useSelector(state => state.user);
    const [notifications, setNotifications] = useState([]);
    const [userNotifications, setUserNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all notifications (for admin)
    const fetchAllNotifications = async () => {
        try {
            setLoading(true);
            const response = await Axios(SummaryApi.getAllNotifications);
            if (response.data.success) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user notifications
    const fetchUserNotifications = async () => {
        try {
            if (!user._id) return;
            
            const response = await Axios(SummaryApi.getUserNotifications);
            if (response.data.success) {
                setUserNotifications(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching user notifications:', error);
        }
    };

    // Create new notification
    const createNotification = async (notificationData) => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.createNotification,
                data: notificationData
            });
            if (response.data.success) {
                await fetchAllNotifications(); // Refresh the list
                toast.success('Notification created successfully!');
                return response.data.data;
            }
        } catch (error) {
            console.error('Error creating notification:', error);
            toast.error('Failed to create notification');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Update notification
    const updateNotification = async (id, updateData) => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.updateNotification,
                url: `${SummaryApi.updateNotification.url}/${id}`,
                data: updateData
            });
            if (response.data.success) {
                await fetchAllNotifications(); // Refresh the list
                toast.success('Notification updated successfully!');
                return response.data.data;
            }
        } catch (error) {
            console.error('Error updating notification:', error);
            toast.error('Failed to update notification');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Delete notification
    const deleteNotification = async (id) => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.deleteNotification,
                url: `${SummaryApi.deleteNotification.url}/${id}`
            });
            if (response.data.success) {
                await fetchAllNotifications(); // Refresh the list
                toast.success('Notification deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Mark notification as read
    const markNotificationAsRead = async (notificationId) => {
        try {
            const response = await Axios({
                ...SummaryApi.markNotificationAsRead,
                url: `${SummaryApi.markNotificationAsRead.url}/${notificationId}`
            });
            if (response.data.success) {
                // Update local state
                setUserNotifications(prev => 
                    prev.map(notification => 
                        notification._id === notificationId 
                            ? { ...notification, read: true }
                            : notification
                    )
                );
                // Refresh admin notifications to update read count
                if (user.role === 'ADMIN') {
                    await fetchAllNotifications();
                }
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all notifications as read
    const markAllNotificationsAsRead = async () => {
        try {
            // Mark each unread notification as read
            const unreadNotifications = userNotifications.filter(n => !n.read);
            for (const notification of unreadNotifications) {
                await markNotificationAsRead(notification._id);
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Get unread count
    const getUnreadCount = () => {
        return userNotifications.filter(n => !n.read).length;
    };

    // Get notification statistics
    const getNotificationStats = async () => {
        try {
            const response = await Axios(SummaryApi.getNotificationStats);
            if (response.data.success) {
                return response.data.data;
            }
            return {
                totalNotifications: 0,
                activeNotifications: 0,
                totalViewers: 0,
                sentToday: 0
            };
        } catch (error) {
            console.error('Error fetching notification stats:', error);
            return {
                totalNotifications: 0,
                activeNotifications: 0,
                totalViewers: 0,
                sentToday: 0
            };
        }
    };

    // Load notifications on component mount and user change
    useEffect(() => {
        if (user._id) {
            if (user.role === 'ADMIN') {
                fetchAllNotifications();
            }
            fetchUserNotifications();
        }
    }, [user._id, user.role]);

    const value = {
        notifications,
        userNotifications,
        loading,
        createNotification,
        updateNotification,
        deleteNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getUnreadCount,
        getNotificationStats,
        fetchAllNotifications,
        fetchUserNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}; 