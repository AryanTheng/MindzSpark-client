import React from 'react';

const Security = () => (
  <div className="min-h-[70vh] bg-gray-100 py-8 px-2 md:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">Payment Security</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Our Security Measures</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>SSL encryption for all transactions</li>
          <li>PCI DSS compliant payment gateways</li>
          <li>Regular security audits and monitoring</li>
          <li>Two-factor authentication for sensitive actions</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Tips for Safe Shopping</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Never share your OTP or password with anyone</li>
          <li>Always check for HTTPS in the website URL</li>
          <li>Beware of phishing emails and fake offers</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-blue-800">FAQs</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><b>Is my payment information safe?</b><br/>Yes, we use industry-standard security measures to protect your data.</li>
          <li><b>What should I do if I suspect fraud?</b><br/>Contact our support team immediately if you notice any suspicious activity.</li>
        </ul>
      </section>
    </div>
  </div>
);

export default Security; 