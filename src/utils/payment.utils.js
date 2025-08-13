import axios from 'axios';
import SummaryApi from '../common/SummaryApi'

export const handlePayment = async (paymentData, callback) => {
  try {
    const token = localStorage.getItem("token");
    const { list_items, totalAmt, addressId, subTotalAmt } = paymentData;
    // Step 1: Create Razorpay order on backend
    const createOrder = await axios.post(
      ...SummaryApi.createRazorpayOrder,
      {
        list_items,
        addressId,
        subTotalAmt,
        totalAmt,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: "MindzSpark Order"
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const { id: order_id, amount, currency } = createOrder.data.order;

    // Step 2: Launch Razorpay Checkout
    const options = {
      key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay public key
      amount: amount,
      currency: currency,
      name: "MindzSpark",
      description: "MindzSpark Order Payment",
      order_id: order_id,
      handler: async function (response) {
        // Step 3: Verify Payment on Backend
        const verifyRes = await axios.post(
          ...SummaryApi.verifyRazorpayOrder,
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (verifyRes.data.success) {
          alert("✅ Payment Successful!");
          callback?.("success", verifyRes.data); // optional callback
        } else {
          alert("❌ Payment Verification Failed!");
          callback?.("failure", verifyRes.data);
        }
      },
      theme: {
        color: "#3399cc"
      }
    };

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded!");
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment error:", err);
    alert("⚠️ Something went wrong, please try again.");
    callback?.("error", err);
  }
};
