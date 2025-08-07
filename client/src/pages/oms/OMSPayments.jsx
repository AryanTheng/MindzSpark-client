import React from 'react';
import { FiDollarSign, FiCreditCard, FiTrendingUp, FiDownload } from 'react-icons/fi';

const OMSPayments = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Settlements</h1>
          <p className="text-gray-600">Track payments, settlements, and financial reports</p>
        </div>
        <button className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          <FiDownload className="w-4 h-4 mr-2" />
          Download Report
        </button>
      </div>

      <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
        <FiDollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Management</h3>
        <p className="text-gray-500 mb-6">This feature is coming soon. You'll be able to track all payments, settlements, and generate financial reports.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-gray-50 rounded-lg">
            <FiCreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Payment Tracking</h4>
            <p className="text-sm text-gray-500">Monitor all transactions</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <FiTrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Settlement Reports</h4>
            <p className="text-sm text-gray-500">Automated settlement tracking</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <FiDownload className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Financial Reports</h4>
            <p className="text-sm text-gray-500">Detailed financial analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OMSPayments;