import React from 'react';

const EPRCompliance = () => (
  <div className="min-h-[70vh] bg-gray-100 py-8 px-2 md:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">EPR Compliance (E-Waste)</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Our E-Waste Policy</h2>
        <p className="text-gray-700 mb-2">
          Mindzspark is committed to environmentally responsible disposal of electronic waste. We comply with all EPR (Extended Producer Responsibility) regulations and encourage customers to recycle their old electronics responsibly.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">How to Dispose E-Waste</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Contact our support to schedule a pickup of your old electronics.</li>
          <li>Drop off e-waste at authorized collection centers.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Contact for E-Waste</h2>
        <p className="text-gray-700 mb-2">
          Email: epr@mindzspark.in<br/>
          Phone: 044-45614700 / 044-67415800
        </p>
      </section>
    </div>
  </div>
);

export default EPRCompliance; 