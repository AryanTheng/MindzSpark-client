import React from 'react';

const TermsOfUse = () => (
  <div className="min-h-[70vh] bg-gray-100 py-8 px-2 md:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">Terms Of Use</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Introduction</h2>
        <p className="text-gray-700 mb-2">
          Welcome to Mindzspark. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">User Responsibilities</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>You must provide accurate and complete information when creating an account.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You agree not to misuse the website or engage in any fraudulent activity.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Intellectual Property</h2>
        <p className="text-gray-700 mb-2">
          All content on this website, including text, graphics, logos, and images, is the property of Mindzspark or its licensors and is protected by applicable copyright laws.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Limitation of Liability</h2>
        <p className="text-gray-700 mb-2">
          Mindzspark is not liable for any indirect, incidental, or consequential damages arising from the use of our website or services.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Changes to Terms</h2>
        <p className="text-gray-700 mb-2">
          We reserve the right to update or modify these terms at any time. Continued use of the website constitutes acceptance of the revised terms.
        </p>
      </section>
    </div>
  </div>
);

export default TermsOfUse; 