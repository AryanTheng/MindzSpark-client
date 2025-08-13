import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiBarChart, FiPieChart } from 'react-icons/fi';
import Axios from '../utils/Axios';

const OrderAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        url: '/api/order/order-stats',
        method: 'GET'
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching order stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-500">Unable to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Trend (Last 6 Months)</h3>
          <FiBarChart className="w-5 h-5 text-blue-600" />
        </div>
        
        {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-end justify-between h-40 gap-2">
              {stats.monthlyRevenue.map((month, index) => {
                const maxRevenue = Math.max(...stats.monthlyRevenue.map(m => m.revenue));
                const height = (month.revenue / maxRevenue) * 100;
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '120px' }}>
                      <div 
                        className="bg-blue-500 rounded-t absolute bottom-0 w-full transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}%` }}
                        title={`${getMonthName(month._id.month)} ${month._id.year}: ${formatCurrency(month.revenue)}`}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      {getMonthName(month._id.month)}<br />
                      {month._id.year}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              {stats.monthlyRevenue.slice(-4).map((month, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm text-gray-600">
                    {getMonthName(month._id.month)} {month._id.year}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(month.revenue)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {month.orders} orders
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No revenue data available
          </div>
        )}
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
          <FiPieChart className="w-5 h-5 text-green-600" />
        </div>
        
        {stats.ordersByStatus && stats.ordersByStatus.length > 0 ? (
          <div className="space-y-3">
            {stats.ordersByStatus.map((status, index) => {
              const percentage = (status.count / stats.totalOrders) * 100;
              const colors = [
                'bg-blue-500',
                'bg-green-500', 
                'bg-yellow-500',
                'bg-red-500',
                'bg-purple-500',
                'bg-indigo-500'
              ];
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {status._id || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {status.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No order status data available
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalOrders > 0 
                  ? Math.round(((stats.totalOrders - stats.pendingOrders) / stats.totalOrders) * 100)
                  : 0
                }%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics;