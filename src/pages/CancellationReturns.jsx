import React from 'react';

const CancellationReturns = () => (
  <div className="min-h-[70vh] bg-gray-100 py-8 px-2 md:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">Cancellation & Returns</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Return & Cancellation Policy</h2>
        <p className="text-gray-700 mb-2">
          You can request a return or cancellation within 7 days of delivery for most products. Some items may have different policies, which will be mentioned on the product page. Refunds are processed within 5-7 business days after the returned item is received and inspected.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">How to Request a Return or Cancellation</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Go to 'My Orders' in your Mindzspark account.</li>
          <li>Select the item you want to return or cancel.</li>
          <li>Follow the on-screen instructions to complete your request.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Frequently Asked Questions (FAQs)</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><b>When will I get my refund?</b><br/>Refunds are processed within 5-7 business days after the returned item is received and inspected.</li>
          <li><b>Are all products eligible for return?</b><br/>Some products may not be eligible for return due to hygiene or other reasons. Please check the product page for details.</li>
          <li><b>How do I cancel an order?</b><br/>Go to 'My Orders', select the order, and choose 'Cancel'.</li>
        </ul>
      </section>
    </div>
  </div>
);

export default CancellationReturns; 