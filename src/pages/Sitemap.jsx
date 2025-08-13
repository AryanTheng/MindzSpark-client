import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from '../utils/Axios';

const Sitemap = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Axios.get('/api/category')
      .then(res => {
        console.log(res.data);
        setCategories(res.data?.categories || []);
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="min-h-[70vh] bg-gray-100 py-8 px-2 md:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">Sitemap</h1>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">Main Pages</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/mindzspark-stories">Mindzspark Stories</Link></li>
            <li><Link to="/press">Press</Link></li>
            <li><Link to="/payments">Payments</Link></li>
            <li><Link to="/shipping">Shipping</Link></li>
            <li><Link to="/cancellation-returns">Cancellation & Returns</Link></li>
            <li><Link to="/terms-of-use">Terms Of Use</Link></li>
            <li><Link to="/security">Payment Security</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/grievance-redressal">Grievance Redressal</Link></li>
            <li><Link to="/epr-compliance">EPR Compliance</Link></li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2 text-blue-800">Categories & Subcategories</h2>
          {categories.length === 0 ? (
            <div className="text-gray-600">No categories found.</div>
          ) : (
            <ul className="pl-6">
              {categories.map(cat => (
                <li key={cat._id} className="mb-2">
                  <Link to={`/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} className="font-semibold text-blue-700 hover:underline">
                    {cat.name}
                  </Link>
                  {cat.subCategory && cat.subCategory.length > 0 && (
                    <ul className="pl-4 list-disc text-gray-700">
                      {cat.subCategory.map(sub => (
                        <li key={sub._id}>
                          <Link to={`/${cat.name.toLowerCase().replace(/\s+/g, '-')}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`} className="hover:underline">
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Sitemap; 