import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  HiChevronRight, 
  HiStar,
  HiClock,
  HiTruck,
  HiCheckCircle,
  HiXCircle,
  HiRefresh,
  HiEye,
  HiDownload
} from 'react-icons/hi'
import { FiMapPin, FiCalendar } from 'react-icons/fi'

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

const getOrderStatusDisplay = (order) => {
  const status = getOrderStatus(order);
  switch (status) {
    case 'delivered':
      return { 
        text: 'Delivered', 
        shortText: 'Delivered',
        color: 'text-green-600', 
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: HiCheckCircle
      };
    case 'shipped':
      return { 
        text: 'Shipped', 
        shortText: 'Shipped',
        color: 'text-blue-600', 
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: HiTruck
      };
    case 'processing':
      return { 
        text: 'Processing', 
        shortText: 'Processing',
        color: 'text-purple-600', 
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        icon: HiRefresh
      };
    case 'confirmed':
      return { 
        text: 'Confirmed', 
        shortText: 'Confirmed',
        color: 'text-blue-600', 
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: HiCheckCircle
      };
    case 'cancelled':
      return { 
        text: 'Cancelled', 
        shortText: 'Cancelled',
        color: 'text-red-600', 
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: HiXCircle
      };
    case 'cod':
      return { 
        text: 'Cash on Delivery', 
        shortText: 'COD',
        color: 'text-yellow-600', 
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: HiClock
      };
    case 'paid':
      return { 
        text: 'Paid', 
        shortText: 'Paid',
        color: 'text-green-600', 
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: HiCheckCircle
      };
    default:
      return { 
        text: 'Pending', 
        shortText: 'Pending',
        color: 'text-gray-600', 
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        icon: HiClock
      };
  }
};

const OrderCard = ({ order, isAdmin = false, className = '' }) => {
  const navigate = useNavigate();
  const statusDisplay = getOrderStatusDisplay(order);
  const StatusIcon = statusDisplay.icon;

  const handleCardClick = () => {
    navigate(`/order/${order._id || order.orderId}`);
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    // Handle different actions like rate, review, download invoice, etc.
    console.log(`Action: ${action} for order: ${order.orderId}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
  };

  const getDeliveryAddress = () => {
    if (order.delivery_address_details) {
      const addr = order.delivery_address_details;
      return `${addr.city}, ${addr.state} ${addr.pincode}`;
    }
    return 'Address not available';
  };

  const getShortAddress = () => {
    if (order.delivery_address_details) {
      const addr = order.delivery_address_details;
      return `${addr.city}, ${addr.state}`;
    }
    return 'Address N/A';
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Mobile Layout - Optimized for all screen sizes */}
      <div className="block lg:hidden">
        <div className="p-3 sm:p-4">
          <div className="flex space-x-3">
            {/* Product Image - Responsive sizing */}
            <div className="flex-shrink-0">
              <img
                src={order.product_details?.image?.[0]}
                alt={order.product_details?.name}
                className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=${encodeURIComponent((order.product_details?.name || 'P').charAt(0))}`;
                }}
              />
            </div>

            {/* Order Details - Flexible layout */}
            <div className="flex-1 min-w-0">
              {/* Header with product name and status */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-xs xs:text-sm sm:text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-tight">
                    {truncateText(order.product_details?.name, 50)}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    #{order.orderId}
                  </p>
                </div>
                {/* Status Badge - Responsive */}
                <div className={`inline-flex items-center px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.color} border ${statusDisplay.borderColor} flex-shrink-0`}>
                  <StatusIcon className="w-2.5 h-2.5 xs:w-3 xs:h-3 mr-1" />
                  <span className="hidden xs:inline">{statusDisplay.shortText}</span>
                  <span className="xs:hidden">{statusDisplay.shortText.substring(0, 3)}</span>
                </div>
              </div>

              {/* Price and Date Row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900">
                  ₹{order.totalAmt || order.subTotalAmt || 'N/A'}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <FiCalendar className="w-2.5 h-2.5 xs:w-3 xs:h-3 mr-1" />
                  <span className="hidden xs:inline">{formatDate(order.createdAt)}</span>
                  <span className="xs:hidden">{formatDateShort(order.createdAt)}</span>
                </span>
              </div>

              {/* Delivery Address - Responsive visibility */}
              {order.delivery_address_details && (
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <FiMapPin className="w-2.5 h-2.5 xs:w-3 xs:h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    <span className="hidden sm:inline">{getDeliveryAddress()}</span>
                    <span className="sm:hidden">{getShortAddress()}</span>
                  </span>
                </div>
              )}

              {/* Admin Info - Compact */}
              {isAdmin && order.userId && (
                <div className="text-xs text-gray-500 mb-2 truncate">
                  <span className="hidden xs:inline">Customer: </span>
                  {truncateText(order.userId.name, 20)}
                </div>
              )}

              {/* Action Buttons - Responsive layout */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-2 xs:space-x-3">
                  {statusDisplay.text === 'Delivered' && (
                    <button 
                      onClick={(e) => handleActionClick(e, 'rate')}
                      className="text-xs text-blue-600 font-medium flex items-center space-x-1 hover:text-blue-700"
                    >
                      <HiStar className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                      <span className="hidden xs:inline">Rate</span>
                    </button>
                  )}
                  <button 
                    onClick={(e) => handleActionClick(e, 'invoice')}
                    className="text-xs text-gray-600 font-medium flex items-center space-x-1 hover:text-gray-700"
                  >
                    <HiDownload className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                    <span className="hidden xs:inline">Invoice</span>
                  </button>
                </div>
                <HiChevronRight className="w-3 h-3 xs:w-4 xs:h-4 text-gray-400 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Unchanged but improved */}
      <div className="hidden lg:block">
        <div className="p-6">
          <div className="flex items-center space-x-6">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <img
                src={order.product_details?.image?.[0]}
                alt={order.product_details?.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=${encodeURIComponent((order.product_details?.name || 'P').charAt(0))}`;
                }}
              />
            </div>
            
            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-gray-900 line-clamp-1 mb-1">
                {order.product_details?.name}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                Order #{order.orderId}
              </p>
              
              {/* Delivery Address */}
              {order.delivery_address_details && (
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FiMapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>{getDeliveryAddress()}</span>
                </div>
              )}

              {/* Admin Customer Info */}
              {isAdmin && order.userId && (
                <p className="text-xs text-gray-500">
                  Customer: {order.userId.name} ({order.userId.email || order.userId.mobile})
                </p>
              )}
            </div>
            
            {/* Price and Date */}
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900 mb-1">
                ₹{order.totalAmt || order.subTotalAmt || 'N/A'}
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <FiCalendar className="w-4 h-4 mr-1" />
                {formatDate(order.createdAt)}
              </div>
            </div>
            
            {/* Status and Actions */}
            <div className="flex flex-col items-end space-y-3 min-w-[200px]">
              {/* Status Badge */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.bgColor} ${statusDisplay.color} border ${statusDisplay.borderColor}`}>
                <StatusIcon className="w-4 h-4 mr-2" />
                {statusDisplay.text}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {statusDisplay.text === 'Delivered' && (
                  <button 
                    onClick={(e) => handleActionClick(e, 'rate')}
                    className="text-sm text-blue-600 font-medium flex items-center space-x-1 hover:text-blue-700 transition-colors"
                  >
                    <HiStar className="w-4 h-4" />
                    <span>Rate & Review</span>
                  </button>
                )}
                <button 
                  onClick={(e) => handleActionClick(e, 'view')}
                  className="text-sm text-gray-600 font-medium flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <HiEye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button 
                  onClick={(e) => handleActionClick(e, 'invoice')}
                  className="text-sm text-gray-600 font-medium flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <HiDownload className="w-4 h-4" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Progress Bar (for shipped/processing orders) - Responsive */}
      {(statusDisplay.text === 'Shipped' || statusDisplay.text === 'Processing') && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 lg:px-6 lg:pb-4">
          <div className="bg-gray-100 rounded-full h-1.5 sm:h-2">
            <div 
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                statusDisplay.text === 'Shipped' ? 'bg-blue-500 w-3/4' : 'bg-purple-500 w-1/2'
              }`}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span className="text-xs xs:text-xs">Confirmed</span>
            <span className={`text-xs xs:text-xs ${statusDisplay.text === 'Shipped' ? 'text-blue-600 font-medium' : ''}`}>
              {statusDisplay.shortText}
            </span>
            <span className="text-xs xs:text-xs">Delivered</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;