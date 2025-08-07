import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingCart, 
  FiPackage, 
  FiTruck, 
  FiDollarSign, 
  FiBarChart, 
  FiUsers, 
  FiSettings, 
  FiHelpCircle,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiLogOut
} from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const OMSLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    pendingOrders: 0,
    todayOrders: 0,
    lowStockProducts: 0
  });
  const location = useLocation();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await Axios({
        url: '/api/order/order-stats',
        method: 'GET'
      });

      if (response.data.success) {
        setStats({
          pendingOrders: response.data.data.pendingOrders,
          todayOrders: response.data.data.todayOrders,
          lowStockProducts: 0 // Will be updated when we have product stock data
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: FiHome,
      path: '/admin/oms-dashboard',
      description: 'Overview & Analytics'
    },
    {
      title: 'Orders',
      icon: FiShoppingCart,
      path: '/admin/oms-dashboard/orders',
      description: 'Manage all orders',
      badge: stats.pendingOrders > 0 ? stats.pendingOrders.toString() : null
    },
    {
      title: 'Products',
      icon: FiPackage,
      path: '/admin/oms-dashboard/products',
      description: 'Product management',
      badge: stats.lowStockProducts > 0 ? stats.lowStockProducts.toString() : null
    },
    {
      title: 'Inventory',
      icon: FiTruck,
      path: '/admin/oms-dashboard/inventory',
      description: 'Stock management'
    },
    {
      title: 'Payments',
      icon: FiDollarSign,
      path: '/admin/oms-dashboard/payments',
      description: 'Payment tracking'
    },
    {
      title: 'Analytics',
      icon: FiBarChart,
      path: '/admin/oms-dashboard/analytics',
      description: 'Sales & Performance'
    },
    {
      title: 'Customers',
      icon: FiUsers,
      path: '/admin/oms-dashboard/customers',
      description: 'Customer management'
    },
    {
      title: 'Settings',
      icon: FiSettings,
      path: '/admin/oms-dashboard/settings',
      description: 'Store settings'
    },
    {
      title: 'Help & Support',
      icon: FiHelpCircle,
      path: '/admin/oms-dashboard/support',
      description: 'Get help'
    }
  ];

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      });
      
      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const isActiveRoute = (path) => {
    if (path === '/admin/oms-dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Mz</span>
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900">Admin Abhi</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-3 pb-20 overflow-y-auto h-full">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">
                {user.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="ml-3 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user.name || 'Admin'}
              </div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Fixed Top Header */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left side */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
              >
                <FiMenu className="w-5 h-5" />
              </button>
              
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders, products, customers..."
                  className="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <FiBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-sm">
                      {user.name?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <span className="ml-2 text-gray-700 hidden md:block">{user.name || 'Admin'}</span>
                  <FiChevronDown className="ml-1 w-4 h-4 text-gray-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link
                        to="/admin/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        to="/admin/oms-dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Store Settings
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut className="inline w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content with proper spacing */}
        <main className="pt-16 min-h-screen">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default OMSLayout;