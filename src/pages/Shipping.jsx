import React from 'react';

const Shipping = () => (
  <div className="min-h-[70vh] bg-gray-100 py-8 px-2 md:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">Shipping</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Delivery Timelines</h2>
        <p className="text-gray-700 mb-2">
          We strive to deliver your orders as quickly as possible. Most orders are delivered within 2-7 business days, depending on your location and the seller's warehouse. You can track your order status in your account at any time.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Shipping Partners</h2>
        <p className="text-gray-700 mb-2">
          We partner with leading logistics providers to ensure safe and timely delivery of your products. Our partners include Blue Dart, Delhivery, Ekart, and more.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Frequently Asked Questions (FAQs)</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><b>How can I track my order?</b><br/>You can track your order status in your Mindzspark account under 'My Orders'.</li>
          <li><b>What are the shipping charges?</b><br/>Shipping charges, if any, are displayed at checkout before you place your order.</li>
          <li><b>Can I change my delivery address after placing an order?</b><br/>You can request a change before the order is shipped. Contact support for assistance.</li>
        </ul>
      </section>
    </div>
  </div>
);

export default Shipping; 