import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiDownload } from 'react-icons/hi';

const mockStatusUpdates = [
  {
    title: 'Order Confirmed',
    date: 'Thu, 12th Dec 24',
    details: [
      'Your Order has been placed.',
      'Thu, 12th Dec 24 - 1:40am',
      'Seller has processed your order.',
      'Sat, 14th Dec 24 - 9:28am',
      'Your item has been picked up by delivery partner.',
      'Sun, 15th Dec 24 - 3:58am',
    ],
  },
  {
    title: 'Shipped',
    date: 'Sun, 15th Dec 24',
    details: [
      'Ekart Logistics - FMPP2754112835',
      'Your item has been shipped.',
      'Sun, 15th Dec 24 - 4:03am',
      'Your item has been received in the hub nearest to you',
    ],
  },
  {
    title: 'Out For Delivery',
    date: 'Wed, 18th Dec 24',
    details: [
      'Your item is out for delivery',
      'Wed, 18th Dec 24 - 8:40am',
    ],
  },
  {
    title: 'Delivered',
    date: 'Wed, 18th Dec 24',
    details: [
      'Your item has been delivered',
      'Wed, 18th Dec 24 - 9:37am',
    ],
  },
];

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const orders = useSelector(state => state.orders.order) || [];
  const order = orders.find(o => o._id === orderId || o.orderId === orderId);
  const [showUpdates, setShowUpdates] = useState(false);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-2xl font-semibold mb-2">Order not found</div>
        <button className="text-blue-600 underline" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const product = order.product_details || {};
  const delivery = order.delivery_address_details || order.address || {};
  const price = product.price ?? order.price ?? order.total ?? order.amount ?? order.totalAmount ?? order.subTotalAmt ?? 'N/A';
  const seller = product.seller || product.sellerName || 'Unknown';
  // Use order.statusUpdates if available, else mock
  const statusUpdates = order.statusUpdates || mockStatusUpdates;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Main Card */}
      <div className="flex-1 bg-white rounded shadow p-6 max-w-2xl mx-auto">
        <div className="flex gap-4 items-start">
          <img src={product.image?.[0]} alt={product.name} className="w-28 h-28 object-contain border rounded" />
          <div>
            <div className="font-semibold text-lg mb-1">{product.name}</div>
            <div className="text-gray-500 text-sm mb-1">{product.color} {product.size && `| Size: ${product.size}`}</div>
            <div className="text-gray-600 text-sm mb-1">Seller: {seller}</div>
            <div className="text-xl font-bold text-green-700 mb-2">₹{price}</div>
          </div>
        </div>
        {/* Status Timeline */}
        <div className="mt-6 mb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white">✓</span>
              <span>Order Confirmed, {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</span>
            </div>
            {order.status === 'delivered' && (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white">✓</span>
                <span>Delivered, {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : ''}</span>
              </div>
            )}
          </div>
          <button className="text-blue-600 mt-2 hover:underline" onClick={() => setShowUpdates(true)}>See All Updates &rarr;</button>
        </div>
        {/* Review/Rating */}
        <div className="flex items-center gap-2 mb-4">
          {[1,2,3,4,5].map(i => (
            <span
              key={i}
              className={`text-2xl cursor-pointer ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => { setRating(i); setRated(true); }}
            >★</span>
          ))}
          {rated && <span className="ml-2 text-green-600 font-medium">Thank you for rating!</span>}
        </div>
        {/* Chat and Invoice */}
        <div className="flex items-center gap-6 mb-4">
          <a
            href="https://wa.link/5sqwm1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <span className="text-lg">💬</span> Chat with us
          </a>
          <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <HiDownload /> Download Invoice
          </button>
        </div>
      </div>
      {/* Side Summary */}
      <div className="w-full md:w-96 flex-shrink-0">
        {/* Delivery Details */}
        <div className="bg-white rounded shadow p-4 mb-4">
          <div className="font-semibold mb-2">Delivery details</div>
          {delivery.name && <div className="text-sm text-gray-700 mb-1">{delivery.name}</div>}
          <div className="text-sm text-gray-700 mb-1">
            {[delivery.address_line, delivery.city, delivery.state, delivery.country, delivery.pincode].filter(Boolean).join(', ')}
          </div>
          <div className="text-sm text-gray-700 mb-1">Phone number: {delivery.mobile || ''}</div>
        </div>
        {/* Price Details */}
        <div className="bg-white rounded shadow p-4">
          <div className="font-semibold mb-2">Price Details</div>
          <div className="flex justify-between text-sm mb-1"><span>List price</span><span>₹{product.listPrice ?? price}</span></div>
          <div className="flex justify-between text-sm mb-1"><span>Selling price</span><span>₹{product.sellingPrice ?? price}</span></div>
          <div className="flex justify-between text-sm mb-1"><span>Extra Discount</span><span className="text-green-700">-{product.extraDiscount ?? 0}</span></div>
          <div className="flex justify-between text-sm mb-1"><span>Special Price</span><span>₹{product.specialPrice ?? price}</span></div>
          <div className="flex justify-between text-sm mb-1"><span>Handling Fee</span><span>{product.handlingFee ? `₹${product.handlingFee}` : <span className="text-green-700">Free</span>}</span></div>
          <div className="flex justify-between text-sm mb-1"><span>Platform fee</span><span>{product.platformFee ? `₹${product.platformFee}` : <span className="text-green-700">Free</span>}</span></div>
        </div>
      </div>
      {/* Popup for All Updates */}
      {showUpdates && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto relative p-6">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
              onClick={() => setShowUpdates(false)}
            >
              &times;
            </button>
            <div className="font-bold text-lg mb-4">Order Updates</div>
            <div className="border-l-2 border-green-500 pl-4 flex flex-col gap-6">
              {statusUpdates.map((update, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                  <div className="font-semibold">{update.title} <span className="text-gray-500 text-xs">{update.date}</span></div>
                  <ul className="text-sm text-gray-700 mt-1 list-disc ml-4">
                    {update.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails; 