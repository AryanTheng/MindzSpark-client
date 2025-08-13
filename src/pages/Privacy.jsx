import React from 'react';

const Privacy = () => (
  <div className="min-h-[70vh] bg-gray-100 py-8 px-2 md:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">Privacy Policy</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">What Data We Collect</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Personal information (name, email, address, phone number)</li>
          <li>Order and transaction details</li>
          <li>Device and usage information</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">How We Use Your Data</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>To process orders and provide services</li>
          <li>To improve our website and offerings</li>
          <li>To communicate updates, offers, and support</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Your Rights</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Access, update, or delete your personal data</li>
          <li>Opt out of marketing communications</li>
          <li>Request information about data sharing</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Contact Us</h2>
        <p className="text-gray-700 mb-2">
          If you have any questions about our privacy practices, please contact us at support@mindzspark.in.
        </p>
      </section>
    </div>
  </div>
);

export default Privacy; 