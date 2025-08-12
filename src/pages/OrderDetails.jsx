import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  HiDownload, 
  HiEye, 
  HiPencil, 
  HiX, 
  HiCheck, 
  HiClock,
  HiTruck,
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiUser,
  HiShoppingBag,
  HiCreditCard,
  HiCalendar,
  HiStar,
  HiChat
} from 'react-icons/hi';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [newStatus, setNewStatus] = useState({ title: '', details: '' });
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        url: `/api/order/${orderId}`,
        method: 'GET'
      });

      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        toast.error('Order not found');
        navigate(-1);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to fetch order details');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    if (!newStatus.title) {
      toast.error('Please enter a status title');
      return;
    }

    try {
      const response = await Axios({
        url: '/api/order/add-status-update',
        method: 'POST',
        data: {
          orderId: order._id,
          title: newStatus.title,
          details: newStatus.details || newStatus.title
        }
      });

      if (response.data.success) {
        toast.success('Status updated successfully');
        setShowStatusModal(false);
        setNewStatus({ title: '', details: '' });
        fetchOrderDetails(); // Refresh order data
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  const downloadInvoice = async () => {
    try {
      setDownloadingInvoice(true);
      const response = await Axios({
        url: `/api/order/${orderId}/invoice`,
        method: 'GET'
      });

      if (response.data.success) {
        const invoiceData = response.data.data;
        
        // Generate HTML invoice
        const invoiceHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Invoice - ${invoiceData.orderId}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
              .customer-details, .order-details { width: 48%; }
              .product-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              .product-table th, .product-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              .product-table th { background-color: #f5f5f5; }
              .total-section { text-align: right; margin-top: 20px; }
              .status-updates { margin-top: 30px; }
              .status-item { margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #007bff; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>INVOICE</h1>
              <h2>Mindzspark Shop</h2>
              <p>Your trusted online shopping destination</p>
            </div>
            
            <div class="invoice-details">
              <div class="customer-details">
                <h3>Bill To:</h3>
                <p><strong>${invoiceData.customer.name}</strong></p>
                <p>${invoiceData.customer.email}</p>
                <p>${invoiceData.customer.mobile}</p>
                ${invoiceData.deliveryAddress ? `
                  <p>${invoiceData.deliveryAddress.address_line}</p>
                  <p>${invoiceData.deliveryAddress.city}, ${invoiceData.deliveryAddress.state}</p>
                  <p>${invoiceData.deliveryAddress.pincode}, ${invoiceData.deliveryAddress.country}</p>
                ` : ''}
              </div>
              
              <div class="order-details">
                <h3>Invoice Details:</h3>
                <p><strong>Order ID:</strong> ${invoiceData.orderId}</p>
                <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Order Date:</strong> ${new Date(invoiceData.orderDate).toLocaleDateString()}</p>
                <p><strong>Payment Status:</strong> ${invoiceData.paymentStatus}</p>
              </div>
            </div>
            
            <table class="product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${invoiceData.product.name}</td>
                  <td>1</td>
                  <td>₹${invoiceData.amount.total}</td>
                  <td>₹${invoiceData.amount.total}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="total-section">
              <p><strong>Subtotal: ₹${invoiceData.amount.subtotal}</strong></p>
              <p><strong>Total Amount: ₹${invoiceData.amount.total}</strong></p>
            </div>
            
            <div class="status-updates">
              <h3>Order Status Updates:</h3>
              ${invoiceData.statusUpdates.map(update => `
                <div class="status-item">
                  <strong>${update.title}</strong> - ${update.date}
                  ${update.details.map(detail => `<p>• ${detail}</p>`).join('')}
                </div>
              `).join('')}
            </div>
            
            <div style="margin-top: 40px; text-align: center; color: #666;">
              <p>Thank you for shopping with Mindzspark Shop!</p>
              <p>For any queries, contact us at support@mindzspark.com</p>
            </div>
          </body>
          </html>
        `;

        // Create and download the invoice
        const blob = new Blob([invoiceHTML], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceData.orderId}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast.success('Invoice downloaded successfully');
      }
    } catch (error) {
      toast.error('Failed to download invoice');
      console.error('Error downloading invoice:', error);
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-2xl font-semibold mb-2">Order not found</div>
        <button className="text-blue-600 underline" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const product = order.product_details || {};
  const delivery = order.delivery_address_details || {};
  const statusBadge = getStatusBadge(order);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Orders
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-1">Order #{order.orderId}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusBadge.color}`}>
                {statusBadge.text}
              </span>
              {isAdmin && (
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <HiPencil className="w-4 h-4 mr-2" />
                  Update Status
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Details */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <HiShoppingBag className="w-5 h-5 mr-2" />
                Product Details
              </h2>
              <div className="flex items-start space-x-4">
                {product.image?.[0] && (
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/96x96?text=${encodeURIComponent((product.name || 'P').charAt(0))}`;
                    }}
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(order.totalAmt)}</p>
                    <p className="text-sm text-gray-600">Subtotal: {formatCurrency(order.subTotalAmt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <HiUser className="w-5 h-5 mr-2" />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <HiUser className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{order.userId?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <HiMail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{order.userId?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <HiPhone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{order.userId?.mobile || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {delivery && Object.keys(delivery).length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <HiLocationMarker className="w-5 h-5 mr-2" />
                  Delivery Address
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 leading-relaxed">
                    {delivery.address_line && (
                      <>
                        <strong>{delivery.address_line}</strong><br />
                      </>
                    )}
                    {delivery.city && delivery.state && (
                      <>
                        {delivery.city}, {delivery.state}<br />
                      </>
                    )}
                    {delivery.pincode && delivery.country && (
                      <>
                        {delivery.pincode}, {delivery.country}<br />
                      </>
                    )}
                    {delivery.mobile && (
                      <span className="flex items-center mt-2">
                        <HiPhone className="w-4 h-4 mr-1" />
                        {delivery.mobile}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Order Timeline */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <HiClock className="w-5 h-5 mr-2" />
                Order Timeline
              </h2>
              
              {order.statusUpdates && order.statusUpdates.length > 0 ? (
                <div className="space-y-4">
                  {order.statusUpdates.slice(0, 3).map((status, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <HiCheck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-900">{status.title}</h4>
                          <span className="text-xs text-gray-500">{status.date}</span>
                        </div>
                        {status.details && status.details.length > 0 && (
                          <div className="mt-1">
                            {status.details.slice(0, 2).map((detail, detailIndex) => (
                              <p key={detailIndex} className="text-sm text-gray-600">• {detail}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {order.statusUpdates.length > 3 && (
                    <button
                      onClick={() => setShowUpdates(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View all updates ({order.statusUpdates.length})
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HiClock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No status updates yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="text-gray-900">{order.payment_status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="text-gray-900">
                    {order.payment_status === 'CASH ON DELIVERY' ? 'Cash on Delivery' : 
                     order.payment_status === 'PAID' ? 'Online Payment' : 'Pending'}
                  </span>
                </div>
                <hr className="my-3" />
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-lg text-green-600">{formatCurrency(order.totalAmt)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={downloadInvoice}
                  disabled={downloadingInvoice}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <HiDownload className="w-4 h-4 mr-2" />
                  {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
                </button>
                
                <a
                  href="https://wa.link/5sqwm1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <HiChat className="w-4 h-4 mr-2" />
                  Chat with Support
                </a>

                {order.statusUpdates?.some(s => s.title?.toLowerCase().includes('delivered')) && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600 mb-3">Rate your experience:</p>
                    <div className="flex items-center space-x-1 mb-3">
                      {[1,2,3,4,5].map(i => (
                        <button
                          key={i}
                          onClick={() => { setRating(i); setRated(true); }}
                          className={`text-2xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                        >
                          <HiStar />
                        </button>
                      ))}
                    </div>
                    {rated && <p className="text-sm text-green-600">Thank you for rating!</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Update Order Status</h2>
                    <p className="text-gray-600">Order #{order.orderId}</p>
                  </div>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <HiX className="w-5 h-5" />
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
                      className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateOrderStatus}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <HiCheck className="w-4 h-4 mr-2" />
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Updates Modal */}
        {showUpdates && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">All Order Updates</h2>
                  <button
                    onClick={() => setShowUpdates(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {order.statusUpdates.map((status, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <HiCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{status.title}</h4>
                          <span className="text-sm text-gray-500">{status.date}</span>
                        </div>
                        {status.details && status.details.length > 0 && (
                          <div className="space-y-1">
                            {status.details.map((detail, detailIndex) => (
                              <p key={detailIndex} className="text-sm text-gray-600">• {detail}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails; 