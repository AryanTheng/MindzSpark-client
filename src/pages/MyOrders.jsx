import React, { useState, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import PopupBanner from '../components/CofirmBox'
import { useNavigate } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import { HiSearch } from 'react-icons/hi'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const ORDER_STATUS = [
  { label: 'Pending', value: 'pending' },
  { label: 'On the way', value: 'on_the_way' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Returned', value: 'returned' },
]

const getOrderYear = (date) => new Date(date).getFullYear();
const getOrderMonth = (date) => new Date(date).getMonth();
const getOrderDate = (date) => new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

const getOrderTimeOptions = (orders) => {
  const years = Array.from(new Set(orders.map(o => getOrderYear(o.deliveredAt || o.createdAt)))).sort((a, b) => b - a);
  return [
    { label: 'Last 30 days', value: 'last_30' },
    ...years.map(y => ({ label: y.toString(), value: y.toString() })),
    { label: 'Older', value: 'older' }
  ];
};

const MyOrders = (props) => {
  const orders = useSelector(state => state.orders.order) || [];
  const user = useSelector(state => state.user);
  const [showAuthPopup, setShowAuthPopup] = useState(false)
  const [statusFilter, setStatusFilter] = useState([])
  const [timeFilter, setTimeFilter] = useState('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const [pendingStatusFilter, setPendingStatusFilter] = useState([])
  const [pendingTimeFilter, setPendingTimeFilter] = useState('');
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminTodayOrders, setAdminTodayOrders] = useState([]);
  const [showToday, setShowToday] = useState(false);

  // Filtering logic
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(order => statusFilter.includes(order.status));
    }
    // Time filter
    if (timeFilter) {
      const now = new Date();
      if (timeFilter === 'last_30') {
        filtered = filtered.filter(order => {
          const date = new Date(order.deliveredAt || order.createdAt);
          return (now - date) / (1000 * 60 * 60 * 24) <= 30;
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
    return filtered;
  }, [orders, statusFilter, timeFilter, search]);

  // Group orders by date (deliveredAt or createdAt)
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
      // ... existing code ...
    } catch (error) {
      if (error?.response?.data?.message === 'Provide token') {
        setShowAuthPopup(true)
      }
      AxiosToastError(error)
    }
  }

  // Initialize pending filters from real filters on mount
  useEffect(() => {
    setPendingStatusFilter(statusFilter);
    setPendingTimeFilter(timeFilter);
  }, []);

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

  // In the render, if admin, use adminOrders, else use orders
  const displayOrders = user.role === 'ADMIN' ? (showToday ? adminTodayOrders : adminOrders) : orders;

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
      <div className="flex gap-6 p-4 bg-gray-50 min-h-screen">
        {/* Sidebar Filters */}
        <aside className="w-64 bg-white rounded shadow p-4 h-fit">
          <h2 className="font-semibold mb-4">Filters</h2>
          <div className="mb-6">
            <h3 className="font-medium mb-2">ORDER STATUS</h3>
            {ORDER_STATUS.map(opt => (
              <div key={opt.value} className={pendingStatusFilter.includes(opt.value) ? "mb-1 bg-blue-50 rounded" : "mb-1"}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pendingStatusFilter.includes(opt.value)}
                    onChange={e => {
                      if (e.target.checked) setPendingStatusFilter([...pendingStatusFilter, opt.value]);
                      else setPendingStatusFilter(pendingStatusFilter.filter(s => s !== opt.value));
                    }}
                  />
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-medium mb-2">ORDER TIME</h3>
            {orderTimeOptions.map(opt => (
              <div key={opt.value} className="mb-1">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="orderTime"
                    checked={pendingTimeFilter === opt.value}
                    onChange={() => setPendingTimeFilter(opt.value)}
                  />
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
          <button
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            onClick={() => {
              setStatusFilter(pendingStatusFilter);
              setTimeFilter(pendingTimeFilter);
            }}
          >
            Apply
          </button>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              placeholder="Search your orders here"
              className="border rounded px-4 py-2 w-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1">
              <HiSearch /> Search Orders
            </button>
          </div>
          {/* Admin toggle for all/today's orders */}
          {user.role === 'ADMIN' && (
            <div className="flex gap-2 mb-4">
              <button
                className={`px-4 py-2 rounded ${!showToday ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setShowToday(false)}
              >
                All Orders
              </button>
              <button
                className={`px-4 py-2 rounded ${showToday ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setShowToday(true)}
              >
                Today's Orders
              </button>
            </div>
          )}
          {Object.keys(groupedOrders).length === 0 && <NoData />}
          {Object.entries(groupedOrders).map(([date, orders]) => (
            <div key={date} className="mb-8">
              <h4 className="text-gray-500 font-semibold mb-2">{date}</h4>
              <div className="flex flex-col gap-4">
                {orders.map((order, idx) => {
                  console.log(order);
                  return (
                    <div
                      key={order._id + idx}
                      className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 cursor-pointer hover:shadow-lg transition"
                      onClick={() => navigate(`/order/${order._id || order.orderId}`)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={order.product_details?.image?.[0]}
                          alt={order.product_details?.name}
                          className="w-20 h-20 object-contain border rounded"
                        />
                        <div>
                          <div className="font-medium text-base line-clamp-1">{order.product_details?.name}</div>
                          <div className="text-gray-500 text-sm">{order.product_details?.color && `Color: ${order.product_details.color}`}{order.product_details?.size && `  Size: ${order.product_details.size}`}</div>
                          <div className="text-gray-700 font-semibold mt-1">
                            ₹{order.product_details?.price ?? order.price ?? order.total ?? order.amount ?? order.totalAmount ?? order.subTotalAmt ?? <span className="text-gray-400">N/A</span>}
                          </div>
                          {user.role === 'ADMIN' && order.userId && (
                            <div className="text-xs text-gray-500 mt-1">User: {order.userId.name} ({order.userId.email || order.userId.mobile})</div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 text-sm font-medium">●</span>
                          <span className="text-gray-700 text-sm font-medium">
                            {order.status === 'delivered'
                              ? `Delivered on ${getOrderDate(order.deliveredAt)}`
                              : order.status === 'pending'
                                ? 'Order Pending'
                                : order.status
                                  ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                                  : 'Order Pending'}
                          </span>
                        </div>
                        {order.status === 'delivered' && (
                          <span className="text-xs text-gray-500">Your item has been delivered</span>
                        )}
                        <button className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline">
                          ★ Rate & Review Product
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </main>
      </div>
    </>
  )
}

export default MyOrders
