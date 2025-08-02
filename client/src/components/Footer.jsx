import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStore, FaBullhorn, FaGift, FaQuestionCircle, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaCcPaypal, FaMoneyCheckAlt, FaRegCreditCard, FaTruck } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t bg-neutral-900 text-neutral-100 pt-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12 items-start justify-between">
        {/* Left Sections */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* About Section */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-yellow-400">ABOUT</h3>
            <ul className="space-y-1">
              <li><Link to="/contact-us" className="hover:underline text-neutral-100">Contact Us</Link></li>
              <li><Link to="/about-us" className="hover:underline text-neutral-100">About Us</Link></li>
              <li><Link to="/careers" className="hover:underline text-neutral-100">Careers</Link></li>
              <li><Link to="/mindzspark-stories" className="hover:underline text-neutral-100">Mindzspark Stories</Link></li>
              <li><Link to="/press" className="hover:underline text-neutral-100">Press</Link></li>
              {/* <li><Link to="#" className="hover:underline text-neutral-100">Corporate Information</Link></li> */}
            </ul>
          </div>
          {/* Shop Section */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-yellow-400">SHOP</h3>
            <ul className="space-y-1">
              <li><Link to="/payments" className="hover:underline text-neutral-100">Payments</Link></li>
              <li><Link to="/shipping" className="hover:underline text-neutral-100">Shipping</Link></li>
              <li><Link to="/cancellation-returns" className="hover:underline text-neutral-100">Cancellation & Returns</Link></li>
              {/* <li><Link to="#" className="hover:underline text-neutral-100">FAQ</Link></li> */}
            </ul>
          </div>
          {/* Consumer Policy Section */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-yellow-400">CONSUMER POLICY</h3>
            <ul className="space-y-1">
              <li><Link to="/cancellation-returns" className="hover:underline text-neutral-100">Cancellation & Returns</Link></li>
              <li><Link to="/terms-of-use" className="hover:underline text-neutral-100">Terms Of Use</Link></li>
              <li><Link to="/security" className="hover:underline text-neutral-100">Security</Link></li>
              <li><Link to="/privacy" className="hover:underline text-neutral-100">Privacy</Link></li>
              <li><Link to="/sitemap" className="hover:underline text-neutral-100">Sitemap</Link></li>
              <li><Link to="/grievance-redressal" className="hover:underline text-neutral-100">Grievance Redressal</Link></li>
              <li><Link to="/epr-compliance" className="hover:underline text-neutral-100">EPR Compliance</Link></li>
            </ul>
          </div>
        </div>
        {/* Right Section - Inline Office and Mail Us */}
        <div className="flex flex-col w-full md:w-auto">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Registered Office Address
            <div className="flex-1 min-w-[220px]">
              <h4 className="font-semibold text-base mb-1 text-neutral-400">Registered Office Address:</h4>
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1 text-yellow-400" />
                <address className="not-italic text-sm leading-relaxed">
                  Mindzspark Internet Private Limited,<br />
                  Buildings Alyssa, Begonia &<br />
                  Clove Embassy Tech Village,<br />
                  Outer Ring Road, Devarabeesanahalli Village,<br />
                  Bengaluru, 560103,<br />
                  Karnataka, India
                </address>
              </div>
              <div className="mt-2 text-sm">
                Telephone: <span className="text-blue-400">044-45614700 / 044-67415800</span>
              </div>
            </div> */}
            {/* Mail Us*/}
            <div className="flex-1 min-w-[220px]">
              <h4 className="font-semibold text-base mb-1 text-neutral-400">Mail Us:</h4>
              <address className="not-italic text-sm leading-relaxed">
                Mindzspark<br />
                Avsari khrud,<br />
                Govenrnment college of engineering and research pune<br />
               
                manchar,513703,<br />
                Pune, India
              </address> 
              <div className="mt-3">
                <span className="font-semibold text-base text-neutral-400">Social</span>
              </div>
            </div>
          </div>
        </div>
       </div> 
      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 bg-[#172337] mt-8 py-3 px-2">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Feature Links */}
          <div className="flex flex-wrap items-center gap-8 text-yellow-400 text-base">
            <a href="#" className="flex items-center gap-2"><FaStore /> <span className="text-neutral-100">Become a Seller</span></a>
            <a href="#" className="flex items-center gap-2"><FaBullhorn /> <span className="text-neutral-100">Advertise</span></a>
            <a href="#" className="flex items-center gap-2"><FaGift /> <span className="text-neutral-100">Gift Cards</span></a>
            <a href="#" className="flex items-center gap-2"><FaQuestionCircle /> <span className="text-neutral-100">Help Center</span></a>
          </div>
          {/* Copyright */}
          <div className="text-neutral-100 text-sm">© 2025 Mindzspark.in</div>
          {/* Payment Icons */}
          <div className="flex items-center gap-2">
            <span className="inline-block bg-white rounded p-1"><FaCcVisa className="text-blue-700 text-xl" /></span>
            <span className="inline-block bg-white rounded p-1"><FaCcMastercard className="text-red-600 text-xl" /></span>
            <span className="inline-block bg-white rounded p-1"><FaCcAmex className="text-blue-500 text-xl" /></span>
            <span className="inline-block bg-white rounded p-1"><FaCcDiscover className="text-yellow-500 text-xl" /></span>
            <span className="inline-block bg-white rounded p-1"><FaCcPaypal className="text-blue-700 text-xl" /></span>
            <span className="inline-block bg-white rounded p-1"><FaMoneyCheckAlt className="text-green-700 text-xl" /></span>
            <span className="inline-block bg-white rounded p-1"><FaRegCreditCard className="text-gray-700 text-xl" /></span>
            <span className="inline-block bg-white rounded p-1"><FaTruck className="text-gray-700 text-xl" /></span>
          </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;