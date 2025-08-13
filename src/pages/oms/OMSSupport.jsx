import React from 'react';
import { FiHelpCircle, FiMessageCircle, FiBook, FiPhone } from 'react-icons/fi';

const OMSSupport = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600">Get help and support for your seller account</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
        <FiHelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Help & Support Center</h3>
        <p className="text-gray-500 mb-6">This feature is coming soon. You'll be able to access help documentation, contact support, and get assistance.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-gray-50 rounded-lg">
            <FiBook className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Documentation</h4>
            <p className="text-sm text-gray-500">Comprehensive guides</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <FiMessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Live Chat</h4>
            <p className="text-sm text-gray-500">Real-time support</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <FiPhone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Phone Support</h4>
            <p className="text-sm text-gray-500">Direct phone assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OMSSupport;