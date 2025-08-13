import React from 'react';
import { FiUsers, FiMessageCircle, FiStar, FiMail } from 'react-icons/fi';

const OMSCustomers = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage customer relationships and support</p>
        </div>
        <button className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          <FiMail className="w-4 h-4 mr-2" />
          Send Newsletter
        </button>
      </div>

      <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
        <FiUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Management</h3>
        <p className="text-gray-500 mb-6">This feature is coming soon. You'll be able to manage customer profiles, support tickets, and communication.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-gray-50 rounded-lg">
            <FiUsers className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Customer Profiles</h4>
            <p className="text-sm text-gray-500">Detailed customer information</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <FiMessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Support Tickets</h4>
            <p className="text-sm text-gray-500">Customer support management</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <FiStar className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Reviews & Ratings</h4>
            <p className="text-sm text-gray-500">Customer feedback management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OMSCustomers;