import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PopupBanner from '../components/CofirmBox';
import AxiosToastError from '../utils/AxiosToastError';

const Payments = (props) => {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      // ... existing code ...
    } catch (error) {
      if (error?.response?.data?.message === 'Provide token') {
        setShowAuthPopup(true);
      }
      AxiosToastError(error);
    }
  };

  return (
    <>
      {showAuthPopup && (
        <PopupBanner
          message="Please login or register to proceed with payment."
          onLogin={() => { setShowAuthPopup(false); navigate('/login'); }}
          onRegister={() => { setShowAuthPopup(false); navigate('/register'); }}
          onClose={() => setShowAuthPopup(false)}
        />
      )}
      <div className="min-h-[70vh] bg-gray-100 py-8 px-2 md:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">Payments</h1>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">Payment Options</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Credit/Debit Cards (Visa, MasterCard, American Express, Maestro, etc.)</li>
              <li>Net Banking from leading banks</li>
              <li>UPI (Google Pay, PhonePe, BHIM, etc.)</li>
              <li>Wallets (Paytm, PhonePe, etc.)</li>
              <li>Cash on Delivery (COD)</li>
              <li>EMI (Credit Card & Debit Card EMI options)</li>
              <li>Gift Cards & Vouchers</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">Payment Security</h2>
            <p className="text-gray-700 mb-2">
              All transactions on Mindzspark are secured with SSL encryption and comply with PCI DSS standards. Your card and payment details are never shared with sellers or third parties. We use trusted payment gateways to ensure your information is always safe.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 text-blue-800">Frequently Asked Questions (FAQs)</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><b>Is it safe to use my card on Mindzspark?</b><br/>Yes, all card payments are processed through secure and trusted gateways.</li>
              <li><b>Can I pay with Cash on Delivery?</b><br/>Yes, COD is available on most products and locations.</li>
              <li><b>What if my payment fails?</b><br/>If your payment fails, please retry or use a different payment method. No amount will be deducted for failed transactions.</li>
              <li><b>How do I use a Gift Card or Voucher?</b><br/>You can enter your Gift Card or Voucher code at checkout to redeem its value.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default Payments; 