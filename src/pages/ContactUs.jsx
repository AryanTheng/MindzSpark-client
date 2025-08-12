import React, { useState } from 'react';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would typically send the form data to your backend or an email service
  };

  return (
    <div className="min-h-[70vh] bg-gray-100 py-8 px-2 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Mindzspark Help Center | 24×7 Customer Care Support</h1>
        <p className="text-gray-600 mb-6 max-w-3xl">
          The Mindzspark Help Centre page lists out various types of issues that you may have encountered so that there can be quick resolution and you can go back to shopping online. For example, you can get more information regarding order tracking, delivery date changes, help with returns (and refunds), and much more. The Help Centre also lists out more information that you may need regarding payment, shipping, and more. The page has various filters listed out on the left-hand side so that you can get your queries solved quickly, efficiently, and without a hassle. You can get the Help Centre number or even access support if you need professional help regarding various topics. The support executive will ensure speedy assistance so that your shopping experience is positive and enjoyable.
        </p>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <aside className="bg-white rounded shadow p-4 w-full md:w-64 flex-shrink-0 mb-4 md:mb-0">
            <div className="mb-6">
              <h2 className="font-semibold text-gray-700 mb-2 text-sm">TYPE OF ISSUE</h2>
              <ul className="space-y-2">
                <li className="hover:underline cursor-pointer text-blue-700">Help with your issues</li>
                <li className="hover:underline cursor-pointer">Help with your order</li>
                <li className="hover:underline cursor-pointer">Help with other issues</li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold text-gray-700 mb-2 text-sm">HELP TOPICS</h2>
              <ul className="space-y-2">
                <li className="hover:underline cursor-pointer">Delivery related</li>
                <li className="hover:underline cursor-pointer">Login and my account</li>
                <li className="hover:underline cursor-pointer">Refunds</li>
                <li className="hover:underline cursor-pointer">Payment</li>
                <li className="hover:underline cursor-pointer">Others</li>
              </ul>
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1 bg-white rounded shadow p-6 min-h-[400px]">
            <h2 className="text-xl font-semibold mb-4">Which item are you facing an issue with?</h2>
            <div className="text-gray-500 mb-8">(Your recent orders and issues will appear here. This is a placeholder for now.)</div>
            <div className="border-t pt-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Contact us directly</h2>
              {submitted ? (
                <div className="text-green-600 font-semibold">Thank you for contacting us! We will get back to you soon.</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="subject">Subject</label>
                    <input type="text" id="subject" name="subject" value={form.subject} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                    <textarea id="message" name="message" value={form.message} onChange={handleChange} required rows={4} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold">Send Message</button>
                </form>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 