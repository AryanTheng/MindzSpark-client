import React, { useEffect, useState } from 'react'
import logo from '../assets/logo_mindzspark-removebg-preview.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaUserCircle, FaHeart, FaBell, FaPhone, FaTimes, FaEnvelope, FaWhatsapp, FaEye, FaArrowLeft } from "react-icons/fa";
import { BsCart4, BsTruck, BsBox } from "react-icons/bs";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { MdLocationOn, MdSupport, MdNotifications, MdLocalShipping } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import useMobile from '../hooks/useMobile';
import { useSelector } from 'react-redux';
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import { useNotifications } from '../provider/NotificationProvider';
import { FaUserLarge } from "react-icons/fa6";

const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const [openNotificationMenu, setOpenNotificationMenu] = useState(false)
    const [openTrackOrder, setOpenTrackOrder] = useState(false)
    const [openSupport, setOpenSupport] = useState(false)
    const [openFullNotification, setOpenFullNotification] = useState(false)
    const [selectedFullNotification, setSelectedFullNotification] = useState(null)
    const [trackingNumber, setTrackingNumber] = useState('')
    const cartItem = useSelector(state => state.cartItem.cart)
    const { totalPrice, totalQty } = useGlobalContext()
    const [isScrolled, setIsScrolled] = useState(false)

    // Use notification context
    const { 
        userNotifications, 
        markNotificationAsRead, 
        markAllNotificationsAsRead,
        getUnreadCount 
    } = useNotifications();

    const unreadCount = getUnreadCount();

    // Track scroll for header styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const handleCloseNotificationMenu = () => {
        setOpenNotificationMenu(false)
    }

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }
        navigate("/user")
    }

    const handleTrackOrder = () => {
        if (trackingNumber.trim()) {
            // Here you would typically make an API call to track the order
            alert(`Tracking order: ${trackingNumber}`)
            setOpenTrackOrder(false)
            setTrackingNumber('')
        }
    }

    const handleCallSupport = () => {
        window.location.href = 'tel:+917397901889'
    }

    const handleWhatsAppSupport = () => {
        const message = encodeURIComponent('Hi, I need help with my order.')
        window.open(`https://wa.me/917397901889?text=${message}`, '_blank')
    }

    const handleEmailSupport = () => {
        window.location.href = 'mailto:support@mindzspark.com?subject=Support Request'
    }

    const handleViewFullNotification = (notification) => {
        setSelectedFullNotification(notification)
        setOpenFullNotification(true)
        setOpenNotificationMenu(false)
        markNotificationAsRead(notification._id)
    }

    const handleMarkAllAsRead = () => {
        markAllNotificationsAsRead()
    }

    const getNotificationTypeColor = (type) => {
        const typeColors = {
            'system': 'bg-blue-100 text-blue-800',
            'order': 'bg-green-100 text-green-800',
            'promo': 'bg-purple-100 text-purple-800',
            'alert': 'bg-red-100 text-red-800'
        }
        return typeColors[type] || 'bg-gray-100 text-gray-800'
    }

    const getPriorityColor = (priority) => {
        const priorityColors = {
            'low': 'bg-gray-100 text-gray-800',
            'medium': 'bg-yellow-100 text-yellow-800',
            'high': 'bg-red-100 text-red-800'
        }
        return priorityColors[priority] || 'bg-gray-100 text-gray-800'
    }

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
        <>
            {/* Top Bar - Contact & Support Info */}
            <div className="bg-white text-white py-2 hidden lg:block">
                <div className="container mx-auto px-4 flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-6">
                        <button 
                            onClick={handleCallSupport}
                            className="flex items-center space-x-2 hover:text-green-400 transition-colors cursor-pointer"
                        >
                            <FaPhone className="text-green-400" size={14} />
                            <span>+91 7397901889</span>
                        </button>
                        <div className="flex items-center space-x-2">
                            <MdLocationOn className="text-green-400" size={16} />
                            <span>Free Delivery on orders above ₹499</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => setOpenSupport(true)}
                            className="flex items-center space-x-1 hover:text-green-400 transition-colors cursor-pointer"
                        >
                            <MdSupport size={14} />
                            <span>Support</span>
                        </button>
                        <button 
                            onClick={() => setOpenTrackOrder(true)}
                            className="flex items-center space-x-1 hover:text-green-400 transition-colors cursor-pointer"
                        >
                            <BsTruck className="text-green-400" size={14} />
                            <span>Track Order</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className={`bg-white border-b transition-all duration-300 ${
                isScrolled ? 'shadow-lg' : 'shadow-sm'
            } sticky top-0 z-50`}>
                <div className="container mx-auto px-4">
                    {/* Main Header Content */}
                    <div className="flex items-center justify-between py-4">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center space-x-2 group">
                                        <img 
                                            src={logo}
                                    alt="Mindzspark"
                                    className="h-12 w-auto group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="hidden lg:block">
                                    <h1 className="text-xl font-bold text-gray-800">Mindzspark</h1>
                                    <p className="text-xs text-gray-500">Your Smart Shopping Partner</p>
                                </div>
                            </Link>
                        </div>

                        {/* Search Bar - Desktop */}
                        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                            <Search />
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Desktop Actions */}
                            <div className="hidden lg:flex items-center space-x-6">
                                {/* Wishlist */}
                                <Link to="/wishlist" className="relative group">
                                    <FaHeart className="text-gray-600 group-hover:text-red-500 transition-colors" size={20} />
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                        0
                                    </span>
                                </Link>

                                {/* Notifications */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setOpenNotificationMenu(prev => !prev)}
                                        className="relative group"
                                    >
                                        <FaBell className="text-gray-600 group-hover:text-blue-500 transition-colors" size={20} />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    
                                    {/* Notifications Dropdown */}
                                    {openNotificationMenu && (
                                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                                                    <button 
                                                        onClick={handleCloseNotificationMenu}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaTimes size={16} />
                                                    </button>
                                                </div>
                                                <div className="max-h-64 overflow-y-auto">
                                                    {userNotifications.length > 0 ? (
                                                        userNotifications.map((notification) => (
                                                            <div 
                                                                key={notification.id}
                                                                className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                                                                    notification.read ? 'bg-gray-50' : 'bg-blue-50'
                                                                } hover:bg-gray-100`}
                                                                onClick={() => handleViewFullNotification(notification)}
                                                            >
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center space-x-2 mb-1">
                                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getNotificationTypeColor(notification.type)}`}>
                                                                                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                                                            </span>
                                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                                                                                {notification.priority}
                                                                            </span>
                                                                        </div>
                                                                        <p className={`font-medium text-sm ${
                                                                            notification.read ? 'text-gray-700' : 'text-blue-800'
                                                                        }`}>
                                                                            {notification.title}
                                                                        </p>
                                                                        <p className="text-xs text-gray-600 mt-1">
                                                                            {notification.message}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400 mt-2">
                                                                            {formatTime(notification.createdAt)}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        {!notification.read && (
                                                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                        )}
                                                                        <FaEye className="text-gray-400" size={14} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-8 text-gray-500">
                                                            <MdNotifications size={48} className="mx-auto mb-2 text-gray-300" />
                                                            <p>No notifications yet</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {userNotifications.length > 0 && (
                                                    <div className="border-t pt-3 mt-3">
                                                        <button 
                                                            onClick={handleMarkAllAsRead}
                                                            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Mark all as read
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* User Account */}
                                {user?._id ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenUserMenu(prev => !prev)}
                                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <FaUserLarge className="text-white" size={16} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-gray-800">Account</p>
                                                <p className="text-xs text-gray-500">Welcome back!</p>
                                            </div>
                                            {openUserMenu ? (
                                                <GoTriangleUp className="text-gray-400" size={16} />
                                            ) : (
                                                <GoTriangleDown className="text-gray-400" size={16} />
                                            )}
                                        </button>
                                        {openUserMenu && (
                                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border">
                                                <UserMenu close={handleCloseUserMenu} />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={redirectToLoginPage}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <FaUserCircle className="text-gray-600" size={20} />
                                        <span className="font-medium">Login</span>
                                    </button>
                                )}

                                {/* Cart */}
                                        <button 
                                    onClick={() => navigate('/cart')}
                                    className="relative flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors group"
                                >
                                    <BsCart4 size={20} />
                                    <div className="text-left">
                                        {cartItem.length > 0 ? (
                                            <>
                                                <p className="text-sm font-medium">{totalQty} Items</p>
                                                <p className="text-xs opacity-90">{DisplayPriceInRupees(totalPrice)}</p>
                                            </>
                                        ) : (
                                            <p className="text-sm font-medium">My Cart</p>
                                        )}
                                    </div>
                                            {cartItem.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                                    {totalQty}
                                                </span>
                                            )}
                                        </button>
                                    </div>

                            {/* Mobile Actions */}
                            <div className="lg:hidden flex items-center space-x-3">
                                <button className="text-gray-600" onClick={handleMobileUser}>
                                    <FaUserCircle size={24} />
                                </button>
                                <Link to="/wishlist" className="relative">
                                    <FaHeart className="text-gray-600" size={24} />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                        0
                                    </span>
                                </Link>
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="relative text-gray-600"
                                >
                                    <BsCart4 size={24} />
                                    {cartItem.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                            {totalQty}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {!isSearchPage && (
                        <div className="lg:hidden pb-4">
                            <Search />
                        </div>
                    )}
                </div>
            </header>

            {/* Track Order Modal */}
            {openTrackOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Track Your Order</h3>
                            <button 
                                onClick={() => setOpenTrackOrder(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tracking Number
                            </label>
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Enter your tracking number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleTrackOrder}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Track Order
                            </button>
                            <button
                                onClick={() => setOpenTrackOrder(false)}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                                                    </div>
                                                                </div>
                                                            </div>
            )}

            {/* Support Modal */}
            {openSupport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Contact Support</h3>
                            <button 
                                onClick={() => setOpenSupport(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes size={20} />
                            </button>
                                                </div>
                        <div className="space-y-4">
                            <button
                                onClick={handleCallSupport}
                                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FaPhone className="text-green-600" size={20} />
                                <div className="text-left">
                                    <p className="font-medium text-gray-800">Call Support</p>
                                    <p className="text-sm text-gray-600">+91 7397901889</p>
                                            </div>
                            </button>
                            <button
                                onClick={handleWhatsAppSupport}
                                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FaWhatsapp className="text-green-600" size={20} />
                                <div className="text-left">
                                    <p className="font-medium text-gray-800">WhatsApp Support</p>
                                    <p className="text-sm text-gray-600">Chat with us</p>
                                                        </div>
                            </button>
                            <button
                                onClick={handleEmailSupport}
                                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FaEnvelope className="text-green-600" size={20} />
                                <div className="text-left">
                                    <p className="font-medium text-gray-800">Email Support</p>
                                    <p className="text-sm text-gray-600">support@mindzspark.com</p>
                                            </div>    
                                        </button>
                                    </div>
                                </div>
                </div>
            )}

            {/* Full Notification Modal */}
            {openFullNotification && selectedFullNotification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Notification Details</h3>
                            <button 
                                onClick={() => setOpenFullNotification(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getNotificationTypeColor(selectedFullNotification.type)}`}>
                                    {selectedFullNotification.type.charAt(0).toUpperCase() + selectedFullNotification.type.slice(1)}
                                </span>
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(selectedFullNotification.priority)}`}>
                                    {selectedFullNotification.priority} Priority
                                </span>
                            </div>

                            <div>
                                <h4 className="text-xl font-semibold text-gray-800 mb-3">{selectedFullNotification.title}</h4>
                                <p className="text-gray-600 mb-4 text-sm">{selectedFullNotification.message}</p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-medium text-gray-800 mb-2">Full Message:</h5>
                                    <p className="text-gray-700 leading-relaxed">{selectedFullNotification.fullMessage}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>Received: {formatTime(selectedFullNotification.createdAt)}</span>
                                <span>Status: {selectedFullNotification.read ? 'Read' : 'Unread'}</span>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setOpenFullNotification(false)}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Got it
                            </button>
                            <button
                                onClick={() => setOpenFullNotification(false)}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
        </div>
            )}
        </>
  )
}

export default Header
