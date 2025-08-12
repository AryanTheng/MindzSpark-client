import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiShoppingCart, 
  FiPackage, 
  FiDollarSign, 
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiEye,
  FiRefreshCw,
  FiCalendar,
  FiTarget,
  FiActivity,
  FiStar,
  FiTruck,
  FiCreditCard,
  FiBarChart,
  FiPieChart,
  FiFilter,
  FiDownload,
  FiSettings,
  FiBell,
  FiMapPin,
  FiPhone,
  FiMail
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Axios from '../../utils/Axios';
import toast from 'react-hot-toast';

const OMSOverview = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    monthlyRevenue: [],
    ordersByStatus: [],
    salesTrends: [],
    topProducts: []
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('today');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Fetch orders, stats, and products
      const [ordersResponse, statsResponse, productsResponse] = await Promise.all([
        Axios({ url: '/api/order/all-orders', method: 'GET' }),
        Axios({ url: '/api/order/order-stats', method: 'GET' }),
        Axios({ url: '/api/product/get-all-products', method: 'GET' })
      ]);

      if (ordersResponse.data.success) {
        const orders = ordersResponse.data.data;
        console.log('Sample order structure:', orders[0]); // Debug order structure
        setRecentOrders(orders.slice(0, 5)); // Get 5 most recent orders
        
        // Process sales trends data
        const salesTrendsData = processSalesTrends(orders);
        setSalesData(salesTrendsData);
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      if (productsResponse.data.success) {
        const productsData = productsResponse.data.data;
        console.log('Sample product structure:', productsData[0]); // Debug product structure
        setProducts(productsData);
        
        // Calculate top products based on orders
        if (ordersResponse.data.success) {
          const topProducts = calculateTopProducts(ordersResponse.data.data, productsData);
          setTopProductsData(topProducts);
        }
      }
      
      if (showRefreshLoader) {
        toast.success('Dashboard data refreshed');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const processSalesTrends = (orders) => {
    // Get last 7 days
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        orders: 0,
        revenue: 0
      });
    }

    // Process orders for each day
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      const dayData = last7Days.find(day => day.date === orderDate);
      
      if (dayData) {
        dayData.orders += 1;
        dayData.revenue += order.totalAmt || 0;
      }
    });

    return last7Days;
  };

  const calculateTopProducts = (orders, products) => {
    const productSales = {};
    
    console.log('Calculating top products with:', {
      ordersCount: orders.length,
      productsCount: products.length
    });
    
    // Count sales for each product
    orders.forEach((order, index) => {
      // Try multiple ways to get product ID
      let productId = null;
      
      // Method 1: Direct productId
      if (order.productId) {
        if (typeof order.productId === 'string') {
          productId = order.productId;
        } else if (order.productId._id) {
          productId = order.productId._id;
        }
      }
      
      // Method 2: From product_details
      if (!productId && order.product_details?._id) {
        productId = order.product_details._id;
      }
      
      // Method 3: From nested productId
      if (!productId && order.productId?.productId) {
        productId = order.productId.productId;
      }
      
      if (index < 3) { // Debug first 3 orders
        console.log(`Order ${index + 1} product info:`, {
          orderId: order.orderId,
          productId: order.productId,
          product_details: order.product_details,
          extractedProductId: productId
        });
      }
      
      if (productId) {
        if (!productSales[productId]) {
          productSales[productId] = {
            productId,
            sales: 0,
            revenue: 0,
            productDetails: null
          };
        }
        productSales[productId].sales += 1;
        productSales[productId].revenue += order.totalAmt || 0;
      }
    });

    console.log('Product sales summary:', Object.keys(productSales).length, 'unique products');

    // Add product details and sort by sales
    const topProducts = Object.values(productSales)
      .map(item => {
        // Try to find product by ID with multiple matching strategies
        let product = products.find(p => p._id === item.productId);
        
        // If not found, try string comparison
        if (!product) {
          product = products.find(p => p._id.toString() === item.productId.toString());
        }
        
        // If still not found, try ObjectId comparison
        if (!product) {
          product = products.find(p => String(p._id) === String(item.productId));
        }
        
        console.log('Product matching for ID:', item.productId, 'Found:', product ? product.name : 'NOT FOUND');
        
        return {
          ...item,
          productDetails: product,
          name: product?.name || `Product Not Found (${item.productId})`,
          image: product?.image?.[0] || null
        };
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Top 5 products

    console.log('Final top products:', topProducts.map(p => ({ name: p.name, sales: p.sales })));
    return topProducts;
  };

  const getMaxValue = (data, metric) => {
    if (!data.length) return 100;
    const values = data.map(item => item[metric]);
    return Math.max(...values) || 100;
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const getTimeRangeText = () => {
    switch (timeRange) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'Today';
    }
  };

  const getGrowthPercentage = (current, previous) => {
    if (!previous) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600 bg-green-100';
      case 'CASH ON DELIVERY':
        return 'text-yellow-600 bg-yellow-100';
      case 'ORDER CREATED AT RAZORPAY':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'List a new product in your catalog',
      icon: FiPackage,
      color: 'bg-blue-500',
      link: '/admin/upload-product'
    },
    {
      title: 'Process Orders',
      description: 'Update order status and tracking',
      icon: FiShoppingCart,
      color: 'bg-green-500',
      link: '/admin/oms-dashboard/orders'
    },
    {
      title: 'View Analytics',
      description: 'Check your sales performance',
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      link: '/admin/oms-dashboard/analytics'
    },
    {
      title: 'Manage Inventory',
      description: 'Update stock levels',
      icon: FiClock,
      color: 'bg-orange-500',
      link: '/admin/oms-dashboard/inventory'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Controls */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back to your Seller Hub!</h1>
            <p className="text-blue-100">Here's what's happening with your store {getTimeRangeText().toLowerCase()}.</p>
          </div>
          
          {/* Header Controls */}
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <div className="flex items-center space-x-2">
              <FiCalendar className="w-4 h-4 text-blue-200" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              >
                <option value="today" className="text-gray-900">Today</option>
                <option value="week" className="text-gray-900">This Week</option>
                <option value="month" className="text-gray-900">This Month</option>
                <option value="year" className="text-gray-900">This Year</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>

            {/* Export Button */}
            <button className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200">
              <FiDownload className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>

            {/* Dashboard Icon */}
            <div className="hidden lg:block">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FiActivity className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+5 from yesterday</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiClock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+18% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiDollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              <div className="flex items-center mt-2">
                <FiAlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm text-orange-600">Needs attention</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FiPackage className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <span className="text-sm text-gray-500">Frequently used features</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 ${action.color} rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                  </div>
                  <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sales Trends & Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Sales Trends</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedMetric('revenue')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    selectedMetric === 'revenue'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setSelectedMetric('orders')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    selectedMetric === 'orders'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Orders
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {/* Real Sales Trends Chart */}
            <div className="space-y-4">
              {salesData.length > 0 ? (
                <>
                  <div className="flex items-end space-x-2 h-32">
                    {salesData.map((dayData, index) => {
                      const maxValue = getMaxValue(salesData, selectedMetric);
                      const value = dayData[selectedMetric];
                      const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                          <div className="relative">
                            <div
                              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                              style={{ height: `${Math.max(height, 5)}px`, minHeight: '5px' }}
                              title={`${dayData.day}: ${selectedMetric === 'revenue' ? formatCurrency(value) : `${value} orders`}`}
                            ></div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {selectedMetric === 'revenue' ? formatCurrency(value) : `${value} orders`}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 mt-2">
                            {dayData.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Last 7 days</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>{selectedMetric === 'revenue' ? 'Revenue' : 'Orders'}</span>
                      </div>
                      <span className="text-green-600 font-medium">
                        Total: {selectedMetric === 'revenue' 
                          ? formatCurrency(salesData.reduce((sum, day) => sum + day.revenue, 0))
                          : `${salesData.reduce((sum, day) => sum + day.orders, 0)} orders`
                        }
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <FiBarChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No sales data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
              <span className="text-xs text-gray-500">Based on sales</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {topProductsData.length > 0 ? (
              topProductsData.map((product, index) => {
                const maxSales = topProductsData[0]?.sales || 1;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/40x40?text=${encodeURIComponent(product.name.charAt(0))}`;
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FiPackage className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                    
                    {/* Revenue and Progress */}
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                      <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                        <div
                          className="bg-green-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${(product.sales / maxSales) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback to show actual products from store if no sales data
              products.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {product.image?.[0] ? (
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/40x40?text=${encodeURIComponent(product.name.charAt(0))}`;
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FiPackage className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">Listed Product</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                    <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                      <div className="bg-blue-500 h-1 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {topProductsData.length === 0 && products.length === 0 && (
              <div className="text-center py-8">
                <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No products available</p>
                <Link 
                  to="/admin/upload-product" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                >
                  Add your first product
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                to="/admin/oms-dashboard/orders"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View all <FiArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {order.product_details?.image?.[0] && (
                            <img
                              src={order.product_details.image[0]}
                              alt={order.product_details.name}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/40x40?text=${encodeURIComponent((order.product_details?.name || 'P').charAt(0))}`;
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {order.orderId}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {order.product_details?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalAmt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <FiShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Performance Summary</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Order Fulfillment Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Order Fulfillment Rate</span>
                <span className="text-sm font-semibold text-gray-900">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
                <span className="text-sm font-semibold text-gray-900">4.8/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>

            {/* Return Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Return Rate</span>
                <span className="text-sm font-semibold text-gray-900">2.1%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '21%' }}></div>
              </div>
            </div>

            {/* Response Time */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Avg Response Time</span>
                <span className="text-sm font-semibold text-gray-900">2.3 hrs</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="p-4 flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <FiAlertCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Low Stock Alert</p>
              <p className="text-sm text-gray-500">5 products are running low on stock</p>
            </div>
            <Link to="/admin/oms-dashboard/inventory" className="text-sm text-blue-600 hover:text-blue-700">
              View
            </Link>
          </div>
          
          <div className="p-4 flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiClock className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Pending Orders</p>
              <p className="text-sm text-gray-500">{stats.pendingOrders} orders need processing</p>
            </div>
            <Link to="/admin/oms-dashboard/orders" className="text-sm text-blue-600 hover:text-blue-700">
              Process
            </Link>
          </div>

          <div className="p-4 flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Payment Received</p>
              <p className="text-sm text-gray-500">3 new payments received today</p>
            </div>
            <Link to="/admin/oms-dashboard/payments" className="text-sm text-blue-600 hover:text-blue-700">
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OMSOverview;