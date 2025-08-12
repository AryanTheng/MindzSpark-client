import React from 'react';

const AboutUs = () => (
  <div className="min-h-[70vh] bg-gray-100 py-8 px-2 md:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">About Us</h1>
      <p className="text-lg text-gray-700 mb-8">
        <span className="font-semibold text-blue-800">Mindzspark: Transforming Online Shopping in India</span><br/>
        At Mindzspark, we are committed to making online shopping accessible, affordable, and delightful for everyone. Since our inception, we have strived to bring the widest assortment of products, best prices, and a seamless shopping experience to millions of customers across India.
      </p>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-blue-800">Our Journey</h2>
        <p className="text-gray-700">
          Mindzspark started with a simple mission: to revolutionize the way India shops. Over the years, we have grown into a trusted e-commerce platform, connecting buyers and sellers from every corner of the country. Our journey is marked by innovation, customer-centricity, and a relentless pursuit of excellence.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-blue-800">Our Vision & Values</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li><b>Customer First:</b> We put our customers at the heart of everything we do.</li>
          <li><b>Innovation:</b> We embrace technology and creativity to solve real-world problems.</li>
          <li><b>Integrity:</b> We conduct our business with honesty and transparency.</li>
          <li><b>Inclusivity:</b> We believe in empowering communities and supporting diversity.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-blue-800">Our Impact</h2>
        <p className="text-gray-700">
          From empowering small businesses to creating jobs and supporting local communities, Mindzspark is more than just a marketplace. We are a catalyst for positive change, driving digital transformation and economic growth across India.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2 text-blue-800">Join Us on Our Journey</h2>
        <p className="text-gray-700">
          Whether you are a customer, seller, or partner, we invite you to be a part of the Mindzspark family. Together, we can shape the future of commerce in India.
        </p>
      </section>
    </div>
  </div>
);

export default AboutUs; 