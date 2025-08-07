import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiShoppingCart, 
  FiUsers, 
  FiPackage,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiBarChart
} from 'react-icons/fi';
import Axios from '../../utils/Axios';

const OMSAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
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
      console.error('Error fetching analytics:', error);
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
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <FiDownload className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.5% vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders}</p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8.2% vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats?.totalOrders > 0 ? stats?.totalRevenue / stats?.totalOrders : 0)}
              </p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+3.8% vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiPackage className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">3.2%</p>
              <div className="flex items-center mt-2">
                <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">-0.5% vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FiUsers className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Last 6 months</span>
            </div>
          </div>
          
          {stats?.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-end justify-between h-48 gap-2">
                {stats.monthlyRevenue.map((month, index) => {
                  const maxRevenue = Math.max(...stats.monthlyRevenue.map(m => m.revenue));
                  const height = (month.revenue / maxRevenue) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '160px' }}>
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
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                {stats.monthlyRevenue.slice(-3).map((month, index) => (
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
          </div>
          
          {stats?.ordersByStatus && stats.ordersByStatus.length > 0 ? (
            <div className="space-y-4">
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
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`}></div>
                        <span className="text-sm font-medium text-gray-700">
                          {status._id || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {status.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
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
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
          <div className="space-y-4">
            {[
              { name: 'Arduino Uno R3', sales: 45, revenue: 22500 },
              { name: 'Raspberry Pi 4', sales: 32, revenue: 19200 },
              { name: 'ESP32 Development Board', sales: 28, revenue: 8400 },
              { name: 'Breadboard Kit', sales: 24, revenue: 4800 },
              { name: 'Jumper Wires Set', sales: 20, revenue: 2000 }
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Customers</span>
              <span className="text-sm font-semibold text-gray-900">127</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Returning Customers</span>
              <span className="text-sm font-semibold text-gray-900">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Customer Retention Rate</span>
              <span className="text-sm font-semibold text-gray-900">68%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. Customer Lifetime Value</span>
              <span className="text-sm font-semibold text-gray-900">{formatCurrency(8500)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Customer Satisfaction</span>
              <span className="text-sm font-semibold text-gray-900">4.8/5</span>
            </div>
          </div>
        </div>

        {/* Sales Channels */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Channels</h3>
          <div className="space-y-4">
            {[
              { channel: 'Direct Website', percentage: 65, revenue: 325000 },
              { channel: 'Mobile App', percentage: 25, revenue: 125000 },
              { channel: 'Social Media', percentage: 7, revenue: 35000 },
              { channel: 'Email Marketing', percentage: 3, revenue: 15000 }
            ].map((channel, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{channel.channel}</span>
                  <span className="text-sm text-gray-600">{channel.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${channel.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">{formatCurrency(channel.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">94%</div>
            <div className="text-sm text-gray-600">Order Fulfillment Rate</div>
            <div className="text-xs text-green-600 mt-1">+2% from last month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">2.3 hrs</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
            <div className="text-xs text-green-600 mt-1">-15 min improvement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">2.1%</div>
            <div className="text-sm text-gray-600">Return Rate</div>
            <div className="text-xs text-red-600 mt-1">+0.3% from last month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">87%</div>
            <div className="text-sm text-gray-600">Customer Satisfaction</div>
            <div className="text-xs text-green-600 mt-1">+5% from last month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OMSAnalytics;