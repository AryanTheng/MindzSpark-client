import React from 'react';

const GrievanceRedressal = () => (
  <div className="min-h-[70vh] bg-gray-100 py-8 px-2 md:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">Grievance Redressal</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">How to Raise a Grievance</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Contact our customer support via the Help Center or email at support@mindzspark.in</li>
          <li>If not resolved, escalate to our Grievance Officer at grievance@mindzspark.in</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Grievance Officer Contact</h2>
        <p className="text-gray-700 mb-2">
          Name: Grievance Officer<br/>
          Email: grievance@mindzspark.in<br/>
          Address: Mindzspark, Buildings Alyssa, Begonia & Clove Embassy Tech Village, Outer Ring Road, Devarabeesanahalli Village, Bengaluru, 560103, Karnataka, India
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-blue-800">FAQs</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><b>How long does it take to resolve a grievance?</b><br/>We aim to resolve all grievances within 7 working days.</li>
          <li><b>What if my issue is not resolved?</b><br/>You can escalate to the Grievance Officer for further review.</li>
        </ul>
      </section>
    </div>
  </div>
);

export default GrievanceRedressal; 