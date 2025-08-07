import React from 'react';
import { FiPackage, FiTrendingDown, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

const OMSInventory = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your stock levels</p>
        </div>
        <button className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          <FiRefreshCw className="w-4 h-4 mr-2" />
          Sync Inventory
        </button>
      </div>

      <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
        <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Inventory Management</h3>
        <p className="text-gray-500 mb-6">This feature is coming soon. You'll be able to track stock levels, set reorder points, and manage inventory across multiple locations.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-gray-50 rounded-lg">
            <FiTrendingDown className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Stock Tracking</h4>
            <p className="text-sm text-gray-500">Real-time inventory levels</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <FiAlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Low Stock Alerts</h4>
            <p className="text-sm text-gray-500">Automated reorder notifications</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <FiPackage className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Multi-location</h4>
            <p className="text-sm text-gray-500">Manage multiple warehouses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OMSInventory;