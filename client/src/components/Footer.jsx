import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaStore, 
  FaBullhorn, 
  FaGift, 
  FaQuestionCircle, 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcAmex, 
  FaCcDiscover, 
  FaCcPaypal, 
  FaMoneyCheckAlt, 
  FaRegCreditCard, 
  FaTruck,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaArrowUp,
  FaDownload,
  FaMobile
} from 'react-icons/fa';
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll to top
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <BsFillArrowUpCircleFill size={24} />
        </button>
      )}

      <footer className="bg-gray-900 text-white">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info & Newsletter */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-green-400 mb-4">Mindzspark</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Your trusted partner for all your shopping needs. We offer a wide range of products 
                  with quality assurance and excellent customer service.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <MdLocationOn className="text-green-400" size={20} />
                    <span className="text-gray-300">
                      Avsari khrud, Government College of Engineering and Research, Pune, India
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MdPhone className="text-green-400" size={20} />
                    <span className="text-gray-300">+91 7397901889</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MdEmail className="text-green-400" size={20} />
                    <span className="text-gray-300">support@mindzspark.in</span>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Stay Updated</h4>
                <p className="text-gray-300 mb-4">Subscribe to our newsletter for latest updates and offers</p>
                <form onSubmit={handleNewsletterSubmit} className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <br />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 px-0 py-1 rounded-r-lg transition-colors duration-200"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about-us" className="text-gray-300 hover:text-green-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact-us" className="text-gray-300 hover:text-green-400 transition-colors">Contact Us</Link></li>
                <li><Link to="/careers" className="text-gray-300 hover:text-green-400 transition-colors">Careers</Link></li>
                <li><Link to="/mindzspark-stories" className="text-gray-300 hover:text-green-400 transition-colors">Our Stories</Link></li>
                <li><Link to="/press" className="text-gray-300 hover:text-green-400 transition-colors">Press</Link></li>
                <li><Link to="/payments" className="text-gray-300 hover:text-green-400 transition-colors">Payments</Link></li>
                <li><Link to="/shipping" className="text-gray-300 hover:text-green-400 transition-colors">Shipping</Link></li>
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Customer Support</h4>
              <ul className="space-y-2">
                <li><Link to="/cancellation-returns" className="text-gray-300 hover:text-green-400 transition-colors">Returns & Refunds</Link></li>
                <li><Link to="/terms-of-use" className="text-gray-300 hover:text-green-400 transition-colors">Terms of Use</Link></li>
                <li><Link to="/privacy" className="text-gray-300 hover:text-green-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/security" className="text-gray-300 hover:text-green-400 transition-colors">Security</Link></li>
                <li><Link to="/grievance-redressal" className="text-gray-300 hover:text-green-400 transition-colors">Grievance Redressal</Link></li>
                <li><Link to="/epr-compliance" className="text-gray-300 hover:text-green-400 transition-colors">EPR Compliance</Link></li>
                <li><Link to="/sitemap" className="text-gray-300 hover:text-green-400 transition-colors">Sitemap</Link></li>
              </ul>
            </div>
          </div>

          {/* Social Media & Features */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              
              {/* Social Media */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 font-medium">Follow Us:</span>
                <div className="flex space-x-3">
                  <a href="#" className="bg-gray-800 hover:bg-green-600 p-2 rounded-full transition-colors duration-200">
                    <FaFacebook size={18} />
                  </a>
                  <a href="#" className="bg-gray-800 hover:bg-green-600 p-2 rounded-full transition-colors duration-200">
                    <FaTwitter size={18} />
                  </a>
                  <a href="#" className="bg-gray-800 hover:bg-green-600 p-2 rounded-full transition-colors duration-200">
                    <FaInstagram size={18} />
                  </a>
                  <a href="#" className="bg-gray-800 hover:bg-green-600 p-2 rounded-full transition-colors duration-200">
                    <FaLinkedin size={18} />
                  </a>
                  <a href="#" className="bg-gray-800 hover:bg-green-600 p-2 rounded-full transition-colors duration-200">
                    <FaYoutube size={18} />
                  </a>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors">
                  <FaStore size={16} />
                  <span>Become a Seller</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors">
                  <FaBullhorn size={16} />
                  <span>Advertise</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors">
                  <FaGift size={16} />
                  <span>Gift Cards</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors">
                  <FaQuestionCircle size={16} />
                  <span>Help Center</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 bg-gray-950">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              
              {/* Copyright */}
              <div className="text-gray-300 text-sm">
                © 2025 Mindzspark.in. All rights reserved.
              </div>

              {/* Payment Methods */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-xs mr-2">We Accept:</span>
                <div className="flex space-x-1">
                  <span className="bg-white p-1 rounded">
                    <FaCcVisa className="text-blue-700 text-sm" />
                  </span>
                  <span className="bg-white p-1 rounded">
                    <FaCcMastercard className="text-red-600 text-sm" />
                  </span>
                  <span className="bg-white p-1 rounded">
                    <FaCcAmex className="text-blue-500 text-sm" />
                  </span>
                  <span className="bg-white p-1 rounded">
                    <FaCcDiscover className="text-yellow-500 text-sm" />
                  </span>
                  <span className="bg-white p-1 rounded">
                    <FaCcPaypal className="text-blue-700 text-sm" />
                  </span>
                  <span className="bg-white p-1 rounded">
                    <FaMoneyCheckAlt className="text-green-700 text-sm" />
                  </span>
                  <span className="bg-white p-1 rounded">
                    <FaRegCreditCard className="text-gray-700 text-sm" />
                  </span>
                  <span className="bg-white p-1 rounded">
                    <FaTruck className="text-gray-700 text-sm" />
                  </span>
                </div>
              </div>

              {/* Download App */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-xs">Download App:</span>
                <div className="flex space-x-2">
                  <a href="#" className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors">
                    <FaDownload size={12} />
                    <span>Android</span>
                  </a>
                  <a href="#" className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors">
                    <FaMobile size={12} />
                    <span>iOS</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;