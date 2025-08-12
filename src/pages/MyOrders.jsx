import React, { useState, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import PopupBanner from '../components/CofirmBox'
import OrderCard from '../components/OrderCard'
import OrderSkeleton from '../components/OrderSkeleton'
import { useNavigate } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import { 
  HiSearch, 
  HiFilter, 
  HiX, 
  HiClock,
  HiTruck,
  HiCheckCircle,
  HiXCircle,
  HiRefresh
} from 'react-icons/hi'
import { FiPackage, FiCalendar } from 'react-icons/fi'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'

const ORDER_STATUS = [
  { label: 'All Orders', value: '', icon: HiRefresh },
  { label: 'Pending', value: 'pending', icon: HiClock },
  { label: 'Confirmed', value: 'confirmed', icon: HiCheckCircle },
  { label: 'Processing', value: 'processing', icon: HiRefresh },
  { label: 'Shipped', value: 'shipped', icon: HiTruck },
  { label: 'Delivered', value: 'delivered', icon: HiCheckCircle },
  { label: 'Cancelled', value: 'cancelled', icon: HiXCircle },
  { label: 'Cash on Delivery', value: 'cod', icon: HiClock },
]

const getOrderYear = (date) => new Date(date).getFullYear();
const getOrderDate = (date) => new Date(date).toLocaleDateString('en-IN', { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
});

const getOrderTimeOptions = (orders) => {
  const years = Array.from(new Set(orders.map(o => getOrderYear(o.deliveredAt || o.createdAt)))).sort((a, b) => b - a);
  return [
    { label: 'Last 30 days', value: 'last_30' },
    { label: 'Last 6 months', value: 'last_6_months' },
    ...years.map(y => ({ label: y.toString(), value: y.toString() })),
    { label: 'Older', value: 'older' }
  ];
};

const getOrderStatus = (order) => {
  if (order.payment_status === 'PAID') {
    return 'paid';
  }
  if (order.payment_status === 'CASH ON DELIVERY') {
    return 'cod';
  }
  if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('delivered'))) {
    return 'delivered';
  }
  if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('shipped'))) {
    return 'shipped';
  }
  if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('processing'))) {
    return 'processing';
  }
  if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('confirmed'))) {
    return 'confirmed';
  }
  if (order.statusUpdates?.some(s => s.title?.toLowerCase().includes('cancelled'))) {
    return 'cancelled';
  }
  return 'pending';
};

const MyOrders = () => {
  const user = useSelector(state => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuthPopup, setShowAuthPopup] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [timeFilter, setTimeFilter] = useState('')
  const [search, setSearch] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const navigate = useNavigate()
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminTodayOrders, setAdminTodayOrders] = useState([]);
  const [showToday, setShowToday] = useState(false);

  // Filtering logic
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    
    // Status filter
    if (statusFilter && statusFilter !== '') {
      filtered = filtered.filter(order => {
        const orderStatus = getOrderStatus(order);
        return orderStatus === statusFilter;
      });
    }
    
    // Time filter
    if (timeFilter) {
      const now = new Date();
      if (timeFilter === 'last_30') {
        filtered = filtered.filter(order => {
          const date = new Date(order.deliveredAt || order.createdAt);
          return (now - date) / (1000 * 60 * 60 * 24) <= 30;
        });
      } else if (timeFilter === 'last_6_months') {
        filtered = filtered.filter(order => {
          const date = new Date(order.deliveredAt || order.createdAt);
          return (now - date) / (1000 * 60 * 60 * 24) <= 180;
        });
      } else if (timeFilter === 'older') {
        filtered = filtered.filter(order => getOrderYear(order.deliveredAt || order.createdAt) < (new Date().getFullYear() - 3));
      } else {
        filtered = filtered.filter(order => getOrderYear(order.deliveredAt || order.createdAt).toString() === timeFilter);
      }
    }
    
    // Search filter
    if (search.trim()) {
      filtered = filtered.filter(order =>
        order.product_details?.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.orderId?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, statusFilter, timeFilter, search]);

  // Group orders by date
  const groupedOrders = useMemo(() => {
    const groups = {};
    filteredOrders.forEach(order => {
      const dateKey = getOrderDate(order.deliveredAt || order.createdAt);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(order);
    });
    return groups;
  }, [filteredOrders]);

  const orderTimeOptions = getOrderTimeOptions(orders);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getOrderItems,
        method: 'GET'
      });

      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      if (error?.response?.data?.message === 'Provide token') {
        setShowAuthPopup(true)
      } else {
        AxiosToastError(error)
      }
    } finally {
      setLoading(false);
    }
  }

  // Fetch user orders on component mount
  useEffect(() => {
    if (user && user._id) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user.role === 'ADMIN') {
      if (showToday) {
        Axios({ ...SummaryApi.getTodayOrders, method: 'get' })
          .then(res => {
            if (res.data.success) setAdminTodayOrders(res.data.data || []);
          });
      } else {
        Axios({ ...SummaryApi.getAllOrders, method: 'get' })
          .then(res => {
            if (res.data.success) setAdminOrders(res.data.data || []);
          });
      }
    }
  }, [user.role, showToday]);

  const displayOrders = user.role === 'ADMIN' ? (showToday ? adminTodayOrders : adminOrders) : orders;

  const clearFilters = () => {
    setStatusFilter('');
    setTimeFilter('');
    setSearch('');
  };

  const activeFiltersCount = [statusFilter, timeFilter, search].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-32 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="lg:hidden w-20 h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            {/* Desktop Sidebar Skeleton */}
            <aside className="hidden lg:block w-80 bg-white rounded-lg shadow-sm p-6 h-fit">
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse mb-6"></div>
              <div className="space-y-4">
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content Skeleton */}
            <main className="flex-1">
              <div className="lg:hidden mb-4">
                <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <OrderSkeleton count={3} />
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !user._id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md mx-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to login to view your orders</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showAuthPopup && (
        <PopupBanner
          message="Please login or register to view your orders."
          onLogin={() => { setShowAuthPopup(false); navigate('/login') }}
          onRegister={() => { setShowAuthPopup(false); navigate('/register') }}
          onClose={() => setShowAuthPopup(false)}
        />
      )}
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                  <p className="text-gray-600 mt-1">
                    {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
                    {activeFiltersCount > 0 && ` (filtered)`}
                  </p>
                </div>
                
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  <HiFilter className="w-4 h-4" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-white text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-80 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Orders
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by product name or order ID"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <HiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Order Status Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Order Status</h3>
                <div className="space-y-2">
                  {ORDER_STATUS.map((status) => {
                    const Icon = status.icon;
                    return (
                      <label key={status.value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value={status.value}
                          checked={statusFilter === status.value}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{status.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Time Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Order Time</h3>
                <div className="space-y-2">
                  {orderTimeOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="time"
                        value={option.value}
                        checked={timeFilter === option.value}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <FiCalendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Admin Controls */}
              {user.role === 'ADMIN' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Admin View</h3>
                  <div className="flex space-x-2">
                    <button
                      className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                        !showToday 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setShowToday(false)}
                    >
                      All Orders
                    </button>
                    <button
                      className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                        showToday 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setShowToday(true)}
                    >
                      Today's Orders
                    </button>
                  </div>
                </div>
              )}
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Mobile Search */}
              <div className="lg:hidden mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <HiSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {statusFilter && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Status: {ORDER_STATUS.find(s => s.value === statusFilter)?.label}
                      <button
                        onClick={() => setStatusFilter('')}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <HiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {timeFilter && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Time: {orderTimeOptions.find(t => t.value === timeFilter)?.label}
                      <button
                        onClick={() => setTimeFilter('')}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <HiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Search: "{search}"
                      <button
                        onClick={() => setSearch('')}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <HiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Orders List */}
              {Object.keys(groupedOrders).length === 0 && !loading ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiPackage className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {activeFiltersCount > 0 
                      ? "No orders match your current filters. Try adjusting your search criteria."
                      : "You haven't placed any orders yet. Start shopping to see your orders here."
                    }
                  </p>
                  {activeFiltersCount > 0 ? (
                    <button
                      onClick={clearFilters}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Start Shopping
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedOrders).map(([date, orders]) => (
                    <div key={date}>
                      <div className="flex items-center space-x-2 mb-4">
                        <FiCalendar className="w-4 h-4 text-gray-500" />
                        <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                          {date}
                        </h4>
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-xs text-gray-500">
                          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {orders.map((order, idx) => (
                          <OrderCard 
                            key={order._id + idx} 
                            order={order} 
                            isAdmin={user.role === 'ADMIN'}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-6">
                {/* Order Status Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Order Status</h3>
                  <div className="space-y-3">
                    {ORDER_STATUS.map((status) => {
                      const Icon = status.icon;
                      return (
                        <label key={status.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value={status.value}
                            checked={statusFilter === status.value}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{status.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Time Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Order Time</h3>
                  <div className="space-y-3">
                    {orderTimeOptions.map((option) => (
                      <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="time"
                          value={option.value}
                          checked={timeFilter === option.value}
                          onChange={(e) => setTimeFilter(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <FiCalendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Admin Controls */}
                {user.role === 'ADMIN' && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Admin View</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                          !showToday 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setShowToday(false)}
                      >
                        All Orders
                      </button>
                      <button
                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                          showToday 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setShowToday(true)}
                      >
                        Today's Orders
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MyOrders