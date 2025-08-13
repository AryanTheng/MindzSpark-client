import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import AddToCartButton from '../components/AddToCartButton';
import imageEmpty from '../assets/empty_cart.webp';
import NoData from '../components/NoData';
import { useNavigate, Link } from 'react-router-dom';
import { FaCaretRight } from 'react-icons/fa';
import { handleAddItemCart } from '../store/cartProduct';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

// Utility to get delivery date 7 days after addedDate
function getDeliveryDate(addedDate) {
  const date = new Date(addedDate || Date.now());
  date.setDate(date.getDate() + 7);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

const CartMobile = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, updateCartItem, deleteCartItem, fetchCartItem } = useGlobalContext();
  const cart = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [savedForLater, setSavedForLater] = useState([]);
  const navigate = useNavigate();
  const addressList = useSelector(state => state.addresses.addressList);
  const [step, setStep] = useState(1);

  // Get first address if available
  const defaultAddress = addressList && addressList.length > 0 ? addressList[0] : null;

  // Fetch Save for Later from backend on mount
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await Axios({ ...SummaryApi.getSaveForLater });
        if (res.data.success) {
          setSavedForLater(res.data.data || []);
        }
      } catch (err) {
        setSavedForLater([]);
      }
    };
    fetchSaved();
  }, []);

  useEffect(() => {
    if (!user._id) {
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    }
    // Only move to step 2 if currently on step 1 and user logs in
  }, [user, step]);

  // Save for Later
  const handleSaveForLater = async (item) => {
    try {
      const res = await Axios({
        ...SummaryApi.addToSaveForLater,
        data: { productId: item.productId?._id || item.productId },
      });
      if (res.data.success) {
        setSavedForLater((prev) => [...prev, res.data.data]);
        // Remove from cart in Redux
        const newCart = cart.filter(i => i._id !== item._id);
        dispatch(handleAddItemCart(newCart));
        toast.success('Saved for later');
      }
    } catch (err) {
      toast.error('Failed to save for later');
    }
  };

  // Remove from Cart
  const handleRemoveFromCart = (itemId) => {
    const newCart = cart.filter(i => i._id !== itemId);
    dispatch(handleAddItemCart(newCart));
  };

  // Remove item from 'Save for Later'
  const handleRemoveSaved = async (cartProductId) => {
    try {
      const res = await Axios({
        ...SummaryApi.removeFromSaveForLater,
        data: { cartProductId },
      });
      if (res.data.success) {
        setSavedForLater((prev) => prev.filter((item) => item._id !== cartProductId));
        toast.success('Removed from save for later');
      }
    } catch (err) {
      toast.error('Failed to remove from save for later');
    }
  };

  // Quantity controls
  const handleIncreaseQty = async (item) => {
    try {
      await updateCartItem(item._id, item.quantity + 1);
      toast.success('Quantity increased');
    } catch (err) {
      toast.error('Failed to increase quantity');
    }
  };

  const handleDecreaseQty = async (item) => {
    if (item.quantity === 1) {
      // Remove from cart
      try {
        await deleteCartItem(item._id);
        toast.success('Item removed from cart');
      } catch (err) {
        toast.error('Failed to remove item');
      }
    } else {
      try {
        await updateCartItem(item._id, item.quantity - 1);
        toast.success('Quantity decreased');
      } catch (err) {
        toast.error('Failed to decrease quantity');
      }
    }
  };

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate('/checkout');
      return;
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full mt-8 flex flex-col items-center">
      {/* Delivery Address Section */}
      <div className="w-full max-w-5xl bg-white rounded shadow mt-4 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <div className="text-sm text-gray-600">
            Deliver to: <span className="font-semibold">{user.name || 'Guest'}</span>
            {defaultAddress && defaultAddress.pincode && (
              <span>, {defaultAddress.pincode}</span>
            )}
            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded">HOME</span>
          </div>
          <div className="text-xs text-gray-500 truncate max-w-xs">
            {defaultAddress ? (
              <>
                {defaultAddress.address_line}, {defaultAddress.city}, {defaultAddress.state}, {defaultAddress.country} - {defaultAddress.pincode}
              </>
            ) : (
              'No address saved.'
            )}
          </div>
        </div>
        <button className="border px-4 py-1 rounded text-blue-600 hover:bg-blue-50 text-sm" onClick={() => navigate('/admin/address')}>Change</button>
      </div>

      {/* Main Cart Layout */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 mt-4">
        {/* Cart Items Section */}
        <div className="flex-1">
          <div className="bg-white rounded shadow p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">My Cart</h2>
            {cart && cart.length > 0 ? (
              <div>
                {cart.map((item) => (
                  <div key={item._id} className="flex flex-col gap-2 border-b py-4 last:border-b-0">
                    <div className="flex flex-row items-start gap-4 w-full">
                      {/* Product Image and Details as Link */}
                      <Link to={`/product/${encodeURIComponent(item.productId?.name)}-${item.productId?._id}`} className="flex items-center gap-4 flex-1 min-w-0">
                        <img src={item.productId?.image?.[0]} alt={item.productId?.name} className="w-24 h-24 object-contain border rounded" />
                        <div className="min-w-0">
                          <div className="font-medium text-base text-gray-800 truncate mb-0.5">{item.productId?.name}</div>
                          <div className="text-xs text-gray-500 mb-1">Seller: <span className="uppercase">{item.productId?.seller || 'MISSPERFECT143'}</span></div>
                          <div className="flex items-center gap-2 text-xs text-green-700 font-semibold mb-1">
                            {item.productId?.discount ? `${item.productId?.discount}% Off` : ''}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="line-through text-gray-400 text-xs">₹{item.productId?.price}</span>
                            <span className="font-semibold text-lg text-black">{DisplayPriceInRupees(item.productId?.price - (item.productId?.price * (item.productId?.discount || 0) / 100))}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Or Pay ₹{Math.round((item.productId?.price - (item.productId?.price * (item.productId?.discount || 0) / 100)) * 0.95)} + <span role="img" aria-label="coin">🪙</span> 9</div>
                        </div>
                      </Link>
                      {/* Delivery info */}
                      <div className="text-xs text-gray-600 text-right min-w-[120px]">Delivery by <span className="font-semibold">{getDeliveryDate(item.addedDate)}</span></div>
                    </div>
                    {/* Controls row */}
                    <div className="flex flex-row items-center gap-2 mt-3">
                      <div className="flex items-center border rounded overflow-hidden">
                        <button className="px-2 py-1 text-lg" style={{lineHeight:1}} onClick={() => handleDecreaseQty(item)}>-</button>
                        <span className="px-3 py-1 text-base">{item.quantity}</span>
                        <button className="px-2 py-1 text-lg" style={{lineHeight:1}} onClick={() => handleIncreaseQty(item)}>+</button>
                      </div>
                      <button onClick={() => handleSaveForLater(item)} className="ml-4 text-gray-700 font-medium text-sm hover:underline">SAVE FOR LATER</button>
                      <button onClick={() => handleRemoveFromCart(item._id)} className="ml-2 text-gray-700 font-medium text-sm hover:underline">REMOVE</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <img src={imageEmpty} alt="Empty Cart" className="w-40 h-40 object-contain mb-4" />
                <div className="text-gray-500 mb-2">Your cart is empty.</div>
                <Link to="/" className="bg-green-600 px-4 py-2 text-white rounded">Shop Now</Link>
              </div>
            )}
            {cart && cart.length > 0 && (
              <div className="flex justify-end mt-4">
                <button onClick={redirectToCheckoutPage} className="w-full max-w-xs mx-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded text-lg font-semibold shadow block">PLACE ORDER</button>
              </div>
            )}
          </div>

          {/* Saved For Later Section */}
          <div className="bg-white rounded shadow p-4 mt-4">
            <h2 className="text-lg font-semibold mb-2">Saved For Later ({savedForLater.length})</h2>
            {savedForLater.length === 0 ? (
              <NoData />
            ) : (
              savedForLater.map((item) => (
                <div key={item._id} className="flex items-center gap-4 border-b py-4 last:border-b-0">
                  <Link to={`/product/${encodeURIComponent(item.productId?.name)}-${item.productId?._id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    <img src={item.productId?.image?.[0]} alt={item.productId?.name} className="w-20 h-20 object-contain border rounded" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{item.productId?.name}</div>
                      <div className="font-semibold text-green-700 text-base mt-1">{DisplayPriceInRupees(item.productId?.price - (item.productId?.price * (item.productId?.discount || 0) / 100))}</div>
                    </div>
                  </Link>
                  <button onClick={() => handleRemoveSaved(item._id)} className="text-red-500 text-xs hover:underline">REMOVE</button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Price Details Section */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded shadow p-4 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">PRICE DETAILS</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Price ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
              <span>₹{notDiscountTotalPrice}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Discount</span>
              <span className="text-green-600">- ₹{notDiscountTotalPrice - totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Platform Fee</span>
              <span>₹4</span>
            </div>
            <div className="border-t my-2"></div>
            <div className="flex justify-between font-semibold text-base mb-2">
              <span>Total Amount</span>
              <span>₹{totalPrice + 4}</span>
            </div>
            <div className="text-green-600 text-sm font-medium mb-2">You will save ₹{notDiscountTotalPrice - totalPrice - 4} on this order</div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
              <span className="inline-block w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">✔</span>
              Safe and Secure Payments. Easy returns. 100% Authentic products.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartMobile;
