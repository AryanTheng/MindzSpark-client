import React, { useState, useEffect } from 'react';
import UserMenu from '../components/UserMenu';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBars, FaTimes } from 'react-icons/fa';

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const user = useSelector(state => state.user);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.getElementById('mobile-menu');
      const menuButton = document.getElementById('menu-button');
      
      if (menu && !menu.contains(event.target) && menuButton && !menuButton.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            id="menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-primary-500 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes size={24} />
            ) : (
              <FaBars size={24} />
            )}
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {location.pathname.split('/').pop() || 'Dashboard'}
          </h1>
          <div className="w-6"></div> {/* Spacer for flex alignment */}
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 flex flex-col lg:flex-row">
        {/* Mobile Menu */}
        <div 
          id="mobile-menu"
          className={`lg:hidden fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50 w-64 bg-white shadow-lg`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-64px)] p-2">
            <UserMenu onItemClick={() => setIsMenuOpen(false)} />
          </div>
        </div>

        {/* Overlay for mobile menu */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Desktop Menu */}
        <div className="hidden lg:block w-64 flex-shrink-0 pr-4">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto">
            <UserMenu />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
