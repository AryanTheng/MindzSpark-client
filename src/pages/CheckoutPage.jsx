// All imports remain the same
import { useState, useEffect, useRef } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import AddAddress from '../components/AddAddress';
import { useSelector, useDispatch } from 'react-redux';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import PopupBanner from '../components/CofirmBox';
import { handleAddItemCart } from '../store/cartProduct';
import cod from '../assets/cod.png'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector(state => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector(state => state.cartItem.cart);
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [step, setStep] = useState(2);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [codSafetyPaid, setCodSafetyPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const razorpayLoaded = useRef(false);

  // Simulate user order count (should come from backend)
  const userOrderCount = user.orderHistory?.length || 0;

  // Step 1: Check login
  useEffect(() => {
    if (!user._id) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Step 2: Check address
  const hasAddress = addressList && addressList.length > 0;

  // Step 4: OTP send/verify (placeholder logic)
  const handleSendOtp = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.confirmOrderEmail,
        data: { email: user.email }
      });
      if (res.data.success) {
        setOtpSent(true);
        setError('');
        toast.success('OTP sent successfully!');
      }
    } catch (error) {
      toast.success('Something went wrong please try again later.');
    }
  };
  const handleVerifyOtp = async() => {
    try {
      const res = await Axios({
        ...SummaryApi.verifyOrderOtp,
        data: { email: user.email, otp: otp}
      })
      if (res.data.success){
        setOtpVerified(true);
        setStep(5);
        setError('');
        toast.success('OTP verified!');
      } else {
        setError('Invalid OTP');
      }
    } catch (error) {
      toast.error('Unable to verify otp at this time please try again later.');
    }
  };

  // Step 5: Payment
  const handleSelectPayment = (type) => {
    setPaymentType(type);
    if (type === 'COD' && userOrderCount <= 5) {
      setStep(6);
    } else {
      setStep(7); // For online payment, go to success (simulate)
    }
  };

  // Step 6: COD Safety Payment (simulate)
  const handleCodSafetyPayment = () => {
    setCodSafetyPaid(true);
    setStep(7);
    toast.success('₹50 safety payment received!');
  };

  // Step 7: Place Order Success
  const handlePlaceOrder = async () => {
    try {
      const payload = {
        list_items: cartItemsList,
        addressId: addressList[selectAddress]?._id,
        subTotalAmt: totalPrice,
        totalAmt: totalPrice,
        currency: "INR",
        receipt: "receipt_" + Date.now(),
        notes: { note: "Order from frontend" }
      };
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: payload
      });
      if (response.data.success) {
        toast.success('Order placed successfully!');
        fetchCartItem?.();
        fetchOrder?.();
        dispatch(handleAddItemCart([]));
        navigate('/admin/myorders');
      } else {
        toast.error('Order placement failed!');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Step navigation
  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        razorpayLoaded.current = true;
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    } else {
      razorpayLoaded.current = true;
    }
  }, []);

  // Razorpay payment handler
  const handleOnlinePayment = async () => {
  if (!window.Razorpay || !razorpayLoaded.current) {
    toast.error("Payment gateway not loaded. Please wait and try again.");
    return;
  }

  setLoading(true);

  try {
    // Prepare payload for backend order creation
    const payload = {
      list_items: cartItemsList,
      addressId: addressList[selectAddress]?._id,
      subTotalAmt: totalPrice, // Make sure backend handles paise conversion
      totalAmt: totalPrice,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { note: "Order from frontend" },
    };

    // Create Razorpay order via backend
    const { data: res } = await Axios({
      ...SummaryApi.createRazorpayOrder,
      data: payload,
    });

    if (!res?.success || !res?.order) {
      throw new Error("Payment order creation failed");
    }

    // Razorpay checkout options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: res.order.amount,
      currency: res.order.currency,
      name: "MindzSpark",
      description: "Payment for your order",
      image: logo, // Make sure this is a valid imported asset or absolute URL
      order_id: res.order.id,
      handler: async (response) => {
        try {
          // Verify payment on backend
          const verifyPayload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            addressId: addressList[selectAddress]?._id,
          };

          const verifyRes = await Axios({
            ...SummaryApi.verifyRazorpayPayment,
            data: verifyPayload,
          });

          if (verifyRes.data?.success) {
            toast.success("✅ Payment successful!");
            fetchCartItem?.();
            fetchOrder?.();
            dispatch(handleAddItemCart([]));
            setStep(7);
          } else {
            toast.error("❌ Payment verification failed");
          }
        } catch (err) {
          AxiosToastError(err);
        } finally {
          setLoading(false);
        }
      },
      theme: { color: "#3399cc" },
    };

    // Open Razorpay payment popup
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    if (error?.response?.data?.message === "Provide token") {
      setShowAuthPopup(true);
    } else {
      AxiosToastError(error);
    }
    setLoading(false);
  }
};


  const errormsg = () => {
    toast.error("This Service is Temporarly shutdown kindly use Razorpay or COD for now");
  }

  return (
    <section className='bg-blue-50 min-h-screen'>
      {showAuthPopup && (
        <PopupBanner
          message="Please login or register to continue to checkout."
          onLogin={() => { setShowAuthPopup(false); navigate('/login'); }}
          onRegister={() => { setShowAuthPopup(false); navigate('/register'); }}
          onClose={() => setShowAuthPopup(false)}
        />
      )}
      <div className='container mx-auto p-4 flex flex-col items-center w-full gap-5'>
        <div className='w-full max-w-2xl bg-white rounded shadow p-6'>
          <div className='mb-6 flex justify-between items-center'>
            <h2 className='text-xl font-bold'>Checkout{user._id ? ` - ${user.name}` : ''}</h2>
            <div className='flex gap-2'>
              {[2,3,4,5,6,7].map((s) => (
                <div key={s} className={`w-8 h-2 rounded ${step === s ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              ))}
            </div>
          </div>

          {/* Step 2: Address Selection */}
          {step === 2 && (
            <div>
              <h3 className='text-lg font-semibold mb-2'>Choose your address</h3>
              <div className='bg-white p-2 grid gap-4'>
                {addressList.map((address, index) => (
                  <label key={address._id || index} htmlFor={'address' + index} className={address.status ? '' : 'hidden'}>
                    <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
                      <div>
                        <input
                          id={'address' + index}
                          type='radio'
                          value={index}
                          checked={selectAddress === index}
                          onChange={(e) => setSelectAddress(Number(e.target.value))}
                          name='address'
                        />
                      </div>
                      <div>
                        <p>{address.address_line}</p>
                        <p>{address.city}</p>
                        <p>{address.state}</p>
                        <p>{address.country} - {address.pincode}</p>
                        <p>{address.mobile}</p>
                      </div>
                    </div>
                  </label>
                ))}
                <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
                  Add address
                </div>
              </div>
              <div className='flex justify-between mt-6'>
                <button className='bg-gray-200 px-4 py-2 rounded' onClick={handleBack}>Back</button>
                <button className='bg-blue-600 text-white px-6 py-2 rounded' onClick={() => hasAddress ? handleNext() : toast.error('Please select or add an address.')}>Next</button>
              </div>
              {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
            </div>
          )}

          {/* Step 3: Order Summary */}
          {step === 3 && (
            <div>
              <h3 className='text-lg font-semibold mb-2'>Order Summary</h3>
              <div className='mb-4'>
                {cartItemsList.map((item) => (
                  <div key={item._id} className='flex justify-between items-center border-b py-2'>
                    <div className='flex items-center gap-2'>
                      <img src={item.productId?.image?.[0]} alt={item.productId?.name} className='w-12 h-12 object-contain border rounded' />
                      <span>{item.productId?.name}</span>
                    </div>
                    <span>{DisplayPriceInRupees(item.productId?.price - (item.productId?.price * (item.productId?.discount || 0) / 100))} x {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className='mb-4'>
                <h4 className='font-semibold'>Deliver to:</h4>
                {addressList[selectAddress] ? (
                  <div>
                    <p>{addressList[selectAddress].address_line}, {addressList[selectAddress].city}, {addressList[selectAddress].state}, {addressList[selectAddress].country} - {addressList[selectAddress].pincode}</p>
                    <p>{addressList[selectAddress].mobile}</p>
                  </div>
                ) : (
                  <p>No address selected.</p>
                )}
              </div>
              <div className='mb-4'>
                <h4 className='font-semibold'>Total: {DisplayPriceInRupees(totalPrice)}</h4>
              </div>
              <div className='flex justify-between mt-6'>
                <button className='bg-gray-200 px-4 py-2 rounded' onClick={handleBack}>Back</button>
                <button className='bg-blue-600 text-white px-6 py-2 rounded' onClick={handleNext}>Next</button>
              </div>
            </div>
          )}

          {/* Step 4: OTP Verification */}
          {step === 4 && (
            <div className='flex flex-col items-center'>
              <h3 className='text-lg font-semibold mb-2'>Verify Order with OTP</h3>
              {!otpSent ? (
                <button className='bg-blue-600 text-white px-6 py-2 rounded' onClick={handleSendOtp}>Send OTP</button>
              ) : (
                <div className='flex flex-col items-center gap-2'>
                  <input
                    type='text'
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder='Enter OTP'
                    className='border p-2 rounded'
                  />
                  {error && <div className='text-red-500 text-sm'>{error}</div>}
                  <button className='bg-blue-600 text-white px-6 py-2 rounded' onClick={handleVerifyOtp}>Verify OTP</button>
                </div>
              )}
              <div className='flex justify-between mt-6 w-full'>
                <button className='bg-gray-200 px-4 py-2 rounded' onClick={handleBack}>Back</button>
                <button className='bg-blue-600 text-white px-6 py-2 rounded' onClick={handleNext} disabled={!otpVerified}>Next</button>
              </div>
            </div>
          )}

          {/* Step 5: Payment Type */}
          {step === 5 && (
            <div>
              <h3 className='text-lg font-semibold mb-2'>Select Payment Type</h3>
              <div className='flex flex-col gap-2 mb-4'>
                <button className='flex justify-center items-center border px-4 py-2 rounded hover:bg-blue-50' onClick={() => handleOnlinePayment()}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-8"/></button>
                <button className='flex justify-center items-center border px-4 py-2 rounded hover:bg-blue-50' onClick={() => errormsg()}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-8"/></button>
                <button className='flex justify-center items-center border px-4 py-2 rounded hover:bg-blue-50' onClick={() => errormsg()}>
                  <img src="https://cdn.worldvectorlogo.com/logos/phonepe-1.svg" alt="PhonePe" className="h-8"/></button>
                <button className='flex justify-center items-center border px-4 py-2 rounded hover:bg-blue-50' onClick={() => handleSelectPayment('COD')}>
                  <img src={cod} alt="COD" className="h-8"/><div className='px-4 font-extrabold'>Cash on Delivery</div></button>
                {/* <button className='border px-4 py-2 rounded hover:bg-blue-50' onClick={() => handleSelectPayment('UPI')}>UPI</button>
                <button className='border px-4 py-2 rounded hover:bg-blue-50' onClick={() => handleSelectPayment('Credit')}>Credit Card</button>
                <button className='border px-4 py-2 rounded hover:bg-blue-50' onClick={() => handleSelectPayment('Debit')}>Debit Card</button>
                <button className='border px-4 py-2 rounded hover:bg-blue-50' onClick={() => handleSelectPayment('NetBanking')}>Net Banking</button>
                <button className='border px-4 py-2 rounded hover:bg-blue-50' onClick={() => handleSelectPayment('COD')}>Cash on Delivery (COD)</button> */}
              </div>
              <div className='flex justify-between mt-6'>
                <button className='bg-gray-200 px-4 py-2 rounded' onClick={handleBack}>Back</button>
              </div>
            </div>
          )}

          {/* Step 6: COD Safety Payment */}
          {step === 6 && (
            <div className='flex flex-col items-center'>
              <h3 className='text-lg font-semibold mb-2'>COD Safety Payment</h3>
              <p className='mb-4'>As a safety measure, please pay ₹50 to proceed with Cash on Delivery. (Not required if you have placed more than 5 orders.)</p>
              <button className='bg-orange-500 text-white px-6 py-2 rounded' onClick={handleCodSafetyPayment}>Pay ₹50</button>
              <div className='flex justify-between mt-6 w-full'>
                <button className='bg-gray-200 px-4 py-2 rounded' onClick={handleBack}>Back</button>
              </div>
            </div>
          )}

          {/* Step 7: Order Placed Success */}
          {step === 7 && (
            <div className='flex flex-col items-center'>
              <h3 className='text-lg font-semibold mb-2'>Order Placed Successfully!</h3>
              <p className='mb-4'>Thank you for your order.</p>
              <button className='bg-blue-600 text-white px-6 py-2 rounded' onClick={handlePlaceOrder}>Go to Orders</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
