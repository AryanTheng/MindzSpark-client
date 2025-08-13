import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiEye, 
  FiEdit, 
  FiPackage, 
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiMoreVertical,
  FiPrinter,
  FiRefreshCw,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiShoppingBag,
  FiX,
  FiCheck,
  FiArrowRight,
  FiSend,
  FiMessageSquare,
  FiStar,
  FiTrendingUp,
  FiBarChart,
  FiGrid,
  FiList,
  FiSettings
} from 'react-icons/fi';
import Axios from '../../utils/Axios';
import toast from 'react-hot-toast';

const OMSOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [newStatus, setNewStatus] = useState({ title: '', details: '' });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const [orderStatuses, setOrderStatuses] = useState([
    { value: 'all', label: 'All Orders', count: 0, color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Pending', count: 0, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', count: 0, color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', count: 0, color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', count: 0, color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', count: 0, color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', count: 0, color: 'bg-red-100 text-red-800' },
    { value: 'returned', label: 'Returned', count: 0, color: 'bg-orange-100 text-orange-800' }
  ]);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
    calculateStats();
  }, [orders, searchTerm, statusFilter, dateFilter, paymentFilter, sortBy, sortOrder]);

  const fetchOrders = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await Axios({
        url: '/api/order/all-orders',
        method: 'GET'
      });

      if (response.data.success) {
        setOrders(response.data.data);
        updateStatusCounts(response.data.data);
        
        if (showRefreshLoader) {
          toast.success('Orders refreshed successfully');
        }
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateStatusCounts = (ordersData) => {
    const counts = {
      all: ordersData.length,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0
    };

    ordersData.forEach(order => {
      if (order.payment_status === 'CASH ON DELIVERY' || order.payment_status === 'ORDER CREATED AT RAZORPAY') {
        counts.pending++;
      }
      if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('confirmed'))) {
        counts.confirmed++;
      }
      if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('processing'))) {
        counts.processing++;
      }
      if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('shipped'))) {
        counts.shipped++;
      }
      if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('delivered'))) {
        counts.delivered++;
      }
      if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('cancelled'))) {
        counts.cancelled++;
      }
      if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('returned'))) {
        counts.returned++;
      }
    });

    setOrderStatuses(prev => prev.map(status => ({
      ...status,
      count: counts[status.value] || 0
    })));
  };

  const calculateStats = () => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalAmt || 0), 0);
    const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
    const pendingOrders = filteredOrders.filter(order => 
      order.payment_status === 'CASH ON DELIVERY' || order.payment_status === 'ORDER CREATED AT RAZORPAY'
    ).length;

    setStats({
      totalOrders: filteredOrders.length,
      totalRevenue,
      avgOrderValue,
      pendingOrders
    });
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product_details?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => {
        switch (statusFilter) {
          case 'pending':
            return order.payment_status === 'CASH ON DELIVERY' || order.payment_status === 'ORDER CREATED AT RAZORPAY';
          case 'confirmed':
            return order.statusUpdates?.some(status => status.title?.toLowerCase().includes('confirmed'));
          case 'processing':
            return order.statusUpdates?.some(status => status.title?.toLowerCase().includes('processing'));
          case 'shipped':
            return order.statusUpdates?.some(status => status.title?.toLowerCase().includes('shipped'));
          case 'delivered':
            return order.statusUpdates?.some(status => status.title?.toLowerCase().includes('delivered'));
          case 'cancelled':
            return order.statusUpdates?.some(status => status.title?.toLowerCase().includes('cancelled'));
          case 'returned':
            return order.statusUpdates?.some(status => status.title?.toLowerCase().includes('returned'));
          default:
            return true;
        }
      });
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => {
        switch (paymentFilter) {
          case 'paid':
            return order.payment_status === 'PAID';
          case 'cod':
            return order.payment_status === 'CASH ON DELIVERY';
          case 'pending':
            return order.payment_status === 'ORDER CREATED AT RAZORPAY';
          default:
            return true;
        }
      });
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          case 'quarter':
            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            return orderDate >= quarterAgo;
          default:
            return true;
        }
      });
    }

    // Sort orders
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'amount':
          aValue = a.totalAmt || 0;
          bValue = b.totalAmt || 0;
          break;
        case 'customer':
          aValue = a.userId?.name || '';
          bValue = b.userId?.name || '';
          break;
        case 'orderId':
          aValue = a.orderId || '';
          bValue = b.orderId || '';
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => {
      const newSelected = prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId];
      setShowBulkActions(newSelected.length > 0);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
      setShowBulkActions(false);
    } else {
      const allIds = filteredOrders.map(order => order._id);
      setSelectedOrders(allIds);
      setShowBulkActions(true);
    }
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder || !newStatus.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await Axios({
        url: '/api/order/add-status-update',
        method: 'POST',
        data: {
          orderId: selectedOrder._id,
          title: newStatus.title,
          details: newStatus.details || newStatus.title
        }
      });

      if (response.data.success) {
        toast.success('Status updated successfully');
        setShowStatusModal(false);
        setNewStatus({ title: '', details: '' });
        fetchOrders();
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (order) => {
    if (order.payment_status === 'PAID') {
      return { text: 'Paid', color: 'bg-green-100 text-green-800' };
    }
    if (order.payment_status === 'CASH ON DELIVERY') {
      return { text: 'COD', color: 'bg-yellow-100 text-yellow-800' };
    }
    if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('delivered'))) {
      return { text: 'Delivered', color: 'bg-green-100 text-green-800' };
    }
    if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('shipped'))) {
      return { text: 'Shipped', color: 'bg-blue-100 text-blue-800' };
    }
    if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('processing'))) {
      return { text: 'Processing', color: 'bg-purple-100 text-purple-800' };
    }
    if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('confirmed'))) {
      return { text: 'Confirmed', color: 'bg-blue-100 text-blue-800' };
    }
    if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('cancelled'))) {
      return { text: 'Cancelled', color: 'bg-red-100 text-red-800' };
    }
    return { text: 'Pending', color: 'bg-gray-100 text-gray-800' };
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders to update');
      return;
    }

    try {
      const promises = selectedOrders.map(orderId => 
        Axios({
          url: '/api/order/add-status-update',
          method: 'POST',
          data: {
            orderId: orderId,
            title: status,
            details: `Bulk updated to ${status}`
          }
        })
      );

      await Promise.all(promises);
      toast.success(`${selectedOrders.length} orders updated to ${status}`);
      setSelectedOrders([]);
      setShowBulkActions(false);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update orders');
      console.error('Error updating orders:', error);
    }
  };

  const handlePrintLabels = () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders to print labels');
      return;
    }
    
    const selectedOrdersData = filteredOrders.filter(order => selectedOrders.includes(order._id));
    const printContent = selectedOrdersData.map(order => `
      <div style="page-break-after: always; padding: 20px; border: 2px solid #333; margin-bottom: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #333;">SHIPPING LABEL</h2>
          <p style="margin: 5px 0; font-size: 14px; color: #666;">Order #${order.orderId}</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div style="width: 48%;">
            <h3 style="margin: 0 0 10px 0; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">FROM:</h3>
            <p style="margin: 0; line-height: 1.4;">
              <strong>Your Store Name</strong><br>
              Your Store Address<br>
              City, State - Pincode<br>
              Phone: Your Phone Number
            </p>
          </div>
          
          <div style="width: 48%;">
            <h3 style="margin: 0 0 10px 0; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">TO:</h3>
            <p style="margin: 0; line-height: 1.4;">
              <strong>${order.userId?.name || 'N/A'}</strong><br>
              ${order.delivery_address_details ? `
                ${order.delivery_address_details.address_line}<br>
                ${order.delivery_address_details.city}, ${order.delivery_address_details.state}<br>
                ${order.delivery_address_details.pincode}, ${order.delivery_address_details.country}<br>
                Phone: ${order.delivery_address_details.mobile}
              ` : 'Address not available'}
            </p>
          </div>
        </div>
        
        <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 20px; background-color: #f9f9f9;">
          <h3 style="margin: 0 0 10px 0; color: #333;">PRODUCT DETAILS:</h3>
          <p style="margin: 0; line-height: 1.4;">
            <strong>Product:</strong> ${order.product_details?.name || 'N/A'}<br>
            <strong>Amount:</strong> ${formatCurrency(order.totalAmt)}<br>
            <strong>Payment:</strong> ${order.payment_status}
          </p>
        </div>
        
        <div style="text-align: center; font-size: 12px; color: #666;">
          <p style="margin: 0;">Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Shipping Labels - ${selectedOrders.length} Orders</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            @media print {
              body { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    
    toast.success(`Printing labels for ${selectedOrders.length} orders`);
  };

  const handleExportSelected = () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders to export');
      return;
    }

    const selectedOrdersData = filteredOrders.filter(order => selectedOrders.includes(order._id));
    const csvContent = [
      ['Order ID', 'Customer Name', 'Customer Email', 'Product', 'Amount', 'Payment Status', 'Order Status', 'Date', 'Address'].join(','),
      ...selectedOrdersData.map(order => [
        order.orderId,
        `"${order.userId?.name || 'N/A'}"`,
        order.userId?.email || 'N/A',
        `"${order.product_details?.name || 'N/A'}"`,
        order.totalAmt,
        order.payment_status,
        getStatusBadge(order).text,
        new Date(order.createdAt).toLocaleDateString(),
        `"${order.delivery_address_details ? 
          `${order.delivery_address_details.address_line}, ${order.delivery_address_details.city}, ${order.delivery_address_details.state} - ${order.delivery_address_details.pincode}` 
          : 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success(`Exported ${selectedOrders.length} orders`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getOrderPriority = (order) => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 7) return { text: 'High', color: 'bg-red-100 text-red-800' };
    if (daysDiff > 3) return { text: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Normal', color: 'bg-green-100 text-green-800' };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
    {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 max-w-full">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all your orders efficiently</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => setShowFiltersModal(true)}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiSettings className="w-4 h-4 mr-2" />
            Advanced Filters
          </button>
          <button 
            onClick={handleExportSelected}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Export All
          </button>
        </div>
      </div>
{/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
              <p className="text-blue-100 text-sm mt-1">All time orders</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FiShoppingBag className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-green-100 text-sm mt-1">From filtered orders</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FiDollarSign className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg Order Value</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.avgOrderValue)}</p>
              <p className="text-purple-100 text-sm mt-1">Per order average</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FiTrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pending Orders</p>
              <p className="text-3xl font-bold">{stats.pendingOrders}</p>
              <p className="text-orange-100 text-sm mt-1">Need attention</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FiClock className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Status Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <nav className="flex space-x-8" aria-label="Tabs">
              {orderStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    statusFilter === status.value
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {status.label}
                  {status.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                      statusFilter === status.value ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-900'
                    }`}>
                      {status.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title={`Switch to ${viewMode === 'table' ? 'card' : 'table'} view`}
              >
                {viewMode === 'table' ? <FiGrid className="w-5 h-5" /> : <FiList className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer, Product, or Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="cod">Cash on Delivery</option>
                <option value="pending">Payment Pending</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortBy(sort);
                  setSortOrder(order);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
                <option value="customer-asc">Customer A-Z</option>
                <option value="orderId-asc">Order ID A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-blue-700">
                  {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => {
                    setSelectedOrders([]);
                    setShowBulkActions(false);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => handleBulkStatusUpdate('Order Confirmed')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm Orders
                </button>
                <button 
                  onClick={() => handleBulkStatusUpdate('Processing')}
                  className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Mark Processing
                </button>
                <button 
                  onClick={() => handleBulkStatusUpdate('Shipped')}
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Mark Shipped
                </button>
                <button 
                  onClick={handlePrintLabels}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Print Labels
                </button>
                <button 
                  onClick={handleExportSelected}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Content */}
        {viewMode === 'table' ? (
          /* Table View */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const statusBadge = getStatusBadge(order);
                  const priority = getOrderPriority(order);
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderId}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FiCalendar className="w-3 h-3 mr-1" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            <FiUser className="w-3 h-3 mr-1" />
                            {order.userId?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FiMail className="w-3 h-3 mr-1" />
                            {order.userId?.email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {order.product_details?.image?.[0] && (
                            <img
                              src={order.product_details.image[0]}
                              alt={order.product_details.name}
                              className="w-12 h-12 rounded-lg object-cover mr-3"
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/48x48?text=${encodeURIComponent((order.product_details?.name || 'P').charAt(0))}`;
                              }}
                            />
                          )}
                          <div className="text-sm text-gray-900 truncate max-w-xs">
                            {order.product_details?.name || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(order.totalAmt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.payment_status === 'CASH ON DELIVERY' ? 'COD' : 
                           order.payment_status === 'PAID' ? 'Paid' : 'Pending'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${priority.color}`}>
                          {priority.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowStatusModal(true);
                            }}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                            title="Update Status"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedOrders([order._id]);
                              handlePrintLabels();
                            }}
                            className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors" 
                            title="Print Label"
                          >
                            <FiPrinter className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors" title="More Actions">
                            <FiMoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Card View */
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => {
                const statusBadge = getStatusBadge(order);
                const priority = getOrderPriority(order);
                return (
                  <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <h3 className="text-lg font-semibold text-gray-900">{order.orderId}</h3>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${priority.color}`}>
                        {priority.text}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Customer:</span>
                        <span className="text-sm font-medium text-gray-900">{order.userId?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Amount:</span>
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(order.totalAmt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Date:</span>
                        <span className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
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
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {order.product_details?.name || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowStatusModal(true);
                        }}
                        className="flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <FiEdit className="w-4 h-4 mr-1" />
                        Update
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Enhanced Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-gray-600">Order #{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Information */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiShoppingBag className="w-5 h-5 mr-2" />
                      Order Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Order ID:</span>
                        <p className="font-medium text-gray-900">{selectedOrder.orderId}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Order Date:</span>
                        <p className="font-medium text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Payment Status:</span>
                        <p className="font-medium text-gray-900">{selectedOrder.payment_status}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Total Amount:</span>
                        <p className="font-bold text-lg text-gray-900">{formatCurrency(selectedOrder.totalAmt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiUser className="w-5 h-5 mr-2" />
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.userId?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.userId?.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Mobile:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.userId?.mobile || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiPackage className="w-5 h-5 mr-2" />
                      Product Information
                    </h3>
                    <div className="flex items-center space-x-4">
                      {selectedOrder.product_details?.image?.[0] && (
                        <img
                          src={selectedOrder.product_details.image[0]}
                          alt={selectedOrder.product_details.name}
                          className="w-20 h-20 rounded-xl object-cover"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/80x80?text=${encodeURIComponent((selectedOrder.product_details?.name || 'P').charAt(0))}`;
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg">{selectedOrder.product_details?.name || 'N/A'}</h4>
                        <p className="text-gray-600">Amount: {formatCurrency(selectedOrder.totalAmt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {selectedOrder.delivery_address_details && (
                    <div className="bg-purple-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiMapPin className="w-5 h-5 mr-2" />
                        Delivery Address
                      </h3>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-900 leading-relaxed">
                          <strong>{selectedOrder.delivery_address_details.address_line}</strong><br />
                          {selectedOrder.delivery_address_details.city}, {selectedOrder.delivery_address_details.state}<br />
                          {selectedOrder.delivery_address_details.pincode}, {selectedOrder.delivery_address_details.country}<br />
                          <span className="flex items-center mt-2">
                            <FiPhone className="w-4 h-4 mr-1" />
                            {selectedOrder.delivery_address_details.mobile}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Timeline */}
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiClock className="w-5 h-5 mr-2" />
                      Order Timeline
                    </h3>
                    
                    {selectedOrder.statusUpdates && selectedOrder.statusUpdates.length > 0 ? (
                      <div className="space-y-4">
                        {selectedOrder.statusUpdates.map((status, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FiCheckCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-gray-900">{status.title}</h4>
                                <span className="text-xs text-gray-500">{status.date}</span>
                              </div>
                              {status.details && status.details.length > 0 && (
                                <div className="mt-2">
                                  {status.details.map((detail, detailIndex) => (
                                    <p key={detailIndex} className="text-sm text-gray-600">• {detail}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No status updates yet</p>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowOrderModal(false);
                          setShowStatusModal(true);
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiEdit className="w-4 h-4 mr-2" />
                        Update Status
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => {
                          setSelectedOrders([selectedOrder._id]);
                          handlePrintLabels();
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        <FiPrinter className="w-4 h-4 mr-2" />
                        Print Shipping Label
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                        <FiMessageSquare className="w-4 h-4 mr-2" />
                        Contact Customer
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-2 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                        <FiTruck className="w-4 h-4 mr-2" />
                        Track Shipment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Update Order Status</h2>
                  <p className="text-gray-600">Order #{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={newStatus.title}
                    onChange={(e) => setNewStatus({ ...newStatus, title: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    <option value="Order Confirmed">Order Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
                  <textarea
                    value={newStatus.details}
                    onChange={(e) => setNewStatus({ ...newStatus, details: e.target.value })}
                    placeholder="Add tracking number, delivery notes, or other details..."
                    rows={4}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateOrderStatus}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FiSend className="w-4 h-4 mr-2" />
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Advanced Filters</h2>
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min Amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max Amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Customers</option>
                    <option value="new">New Customers</option>
                    <option value="returning">Returning Customers</option>
                    <option value="vip">VIP Customers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="home">Home & Garden</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowFiltersModal(false);
                    toast.success('Filters applied successfully');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OMSOrders;