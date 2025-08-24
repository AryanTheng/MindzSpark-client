import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { FaAngleRight, FaAngleLeft, FaHeart, FaRegHeart } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import Divider from '../components/Divider';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from '../components/AddToCartButton';
import { useSelector } from 'react-redux';
import PopupBanner from '../components/CofirmBox';
import { toast } from 'react-hot-toast';
import ProductDescription from './ProductDescription';
import ShareButton from './ShareButton';
import ComboSuggestions from './ComboSuggestions';

const ProductDisplayPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const productId = params?.product?.split("-")?.slice(-1)[0];

  const [data, setData] = useState({ name: "", image: [], price: 0, discount: 0 });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const imageContainer = useRef();

  const user = useSelector(state => state.user);
  const [showCombo, setShowCombo] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);


  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);

  const similarContainer = useRef();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [questionSubmitting, setQuestionSubmitting] = useState(false);

  const [notFound, setNotFound] = useState(false);
  const [specOpen, setSpecOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Fetch product details
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId }
      });

      const { data: responseData } = response;

      if (responseData.success && responseData.data && responseData.data._id) {
        setData(responseData.data);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      if (error?.response?.data?.message === 'Provide token') {
        setShowAuthPopup(true);
      }
      setNotFound(true);
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleBuyNow = () => {
    navigate(`/checkout?productId=${data._id}`);
  };

  // Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.getReviews,
          params: { productId },
        });
        if (response.data.success) {
          setReviews(response.data.data.map(r => ({
            user: r.userName,
            text: r.text,
            date: r.date?.slice(0, 10),
            rating: r.rating,
            media: r.media || [],
          })));
        } else {
          setReviews([]);
        }
      } catch {
        setReviews([]);
      }
    };
    if (productId) fetchReviews();
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      const response = await Axios({
        ...SummaryApi.addReview,
        data: {
          productId,
          userId: user._id,
          userName: user.name,
          text: reviewText,
          rating: reviewRating,
        },
      });
      if (response.data.success) {
        setReviews(prev => [
          {
            user: user.name,
            text: reviewText,
            date: new Date().toISOString().slice(0, 10),
            rating: reviewRating,
            media: [],
          },
          ...prev,
        ]);
        setReviewText("");
        setReviewRating(5);
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Wishlist
  useEffect(() => {
    setInWishlist(false); // Reset when product changes; ideally fetch actual status
  }, [data._id]);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (wishlistLoading) return;
    setWishlistLoading(true);
    try {
      if (!inWishlist) {
        await Axios({ ...SummaryApi.addToWishlist, data: { productId: data._id } });
        setInWishlist(true);
        toast.success('Added to wishlist');
      } else {
        await Axios({ ...SummaryApi.removeFromWishlist, data: { productId: data._id } });
        setInWishlist(false);
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      if (error?.response?.data?.message === 'Provide token') {
        setShowAuthPopup(true);
      }
      AxiosToastError(error);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Similar & Frequently Bought
  useEffect(() => {
    const fetchSimilar = async () => {
      if (data.category && data.category[0]) {
        try {
          const response = await Axios({
            ...SummaryApi.getProductByCategory,
            data: { id: data.category[0] },
          });
          if (response.data.success) {
            setSimilarProducts(response.data.data.filter(p => p._id !== data._id));
          } else {
            setSimilarProducts([]);
          }
        } catch {
          setSimilarProducts([]);
        }
      }
    };
    fetchSimilar();
  }, [data.category, data._id]);

  useEffect(() => {
    const fetchFrequentlyBought = async () => {
      if (data.category && data.category[0]) {
        try {
          const response = await Axios({
            ...SummaryApi.getProductByCategory,
            data: { id: data.category[0] },
          });
          if (response.data.success) {
            setFrequentlyBought(
              response.data.data.filter(p => p._id !== data._id).slice(0, 3)
            );
          } else {
            setFrequentlyBought([]);
          }
        } catch {
          setFrequentlyBought([]);
        }
      }
    };
    fetchFrequentlyBought();
  }, [data.category, data._id]);

  // Recently Viewed
  useEffect(() => {
    if (!data._id) return;
    let viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    viewed = viewed.filter(id => id !== data._id);
    viewed.unshift(data._id);
    if (viewed.length > 10) viewed = viewed.slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(viewed));

    const fetchRecentlyViewed = async () => {
      const ids = viewed.filter(id => id !== data._id);
      if (ids.length === 0) {
        setRecentlyViewed([]);
        return;
      }
      try {
        const response = await Axios({
          ...SummaryApi.getProduct,
          data: { ids },
        });
        if (response.data.success) {
          setRecentlyViewed(response.data.data);
        } else {
          setRecentlyViewed([]);
        }
      } catch {
        setRecentlyViewed([]);
      }
    };
    fetchRecentlyViewed();
  }, [data._id]);

  // Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.getQuestions,
          params: { productId: data._id },
        });
        if (response.data.success) {
          setQuestions(response.data.data);
        } else {
          setQuestions([]);
        }
      } catch {
        setQuestions([]);
      }
    };
    if (data._id) fetchQuestions();
  }, [data._id]);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setQuestionSubmitting(true);
    try {
      const response = await Axios({
        ...SummaryApi.addQuestion,
        data: {
          productId: data._id,
          userId: user._id,
          userName: user.name,
          text: questionText,
        },
      });
      if (response.data.success) {
        setQuestions(prev => [response.data.data, ...prev]);
        setQuestionText("");
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setQuestionSubmitting(false);
    }
  };

  // Helpers
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length)
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].reduce((acc, s) => {
    acc[s] = reviews.filter(r => r.rating === s).length;
    return acc;
  }, {});

  const totalRatings = reviews.length || 1;

  // Skeleton (simple)
  const Skeleton = () => (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <div className="bg-gray-100 h-96 rounded" />
      <div className="space-y-3">
        <div className="h-6 bg-gray-100 rounded w-3/4" />
        <div className="h-8 bg-gray-100 rounded w-1/2" />
        <div className="h-24 bg-gray-100 rounded" />
        <div className="h-12 bg-gray-100 rounded" />
      </div>
    </div>
  );

  return (
    <>
      {showAuthPopup && (
        <PopupBanner
          message="You need to login or register to continue."
          onLogin={() => { setShowAuthPopup(false); navigate('/login'); }}
          onRegister={() => { setShowAuthPopup(false); navigate('/register'); }}
          onClose={() => setShowAuthPopup(false)}
        />
      )}

      {notFound ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <span className="text-6xl mb-4">🛒</span>
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <p className="text-gray-600 mb-4">The product you are looking for does not exist or has been removed.</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-green-600 text-white rounded">Go Back</button>
        </div>
      ) : loading ? (
        <Skeleton />
      ) : (
        <section className="container mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Image Gallery */}
          <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md lg:w-full mx-auto lg:h-[80vh] lg:overflow-y-auto lg:sticky lg:top-24">
            <div className="bg-white rounded-lg h-80 sm:h-96 w-full flex items-center justify-center">
              <img
                src={data.image?.[image]}
                alt={data.name}
                className="w-full h-full object-contain transition-transform duration-200 hover:scale-105"
              />
            </div>

            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => imageContainer.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                className="hidden sm:inline-flex p-2 bg-white rounded-full shadow"
              >
                <FaAngleLeft />
              </button>
              <div ref={imageContainer} className="flex gap-2 overflow-x-auto scrollbar-none w-full px-2">
                {data.image?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="thumb"
                    className={`w-20 h-20 object-contain cursor-pointer border-2 rounded-md transition 
                    ${idx === image ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setImage(idx)}
                  />
                ))}
              </div>
              <button
                onClick={() => imageContainer.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                className="hidden sm:inline-flex p-2 bg-white rounded-full shadow"
              >
                <FaAngleRight />
              </button>
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="w-full max-w-xs sm:max-w-sm lg:max-w-2xl lg:w-full mx-auto mt-2 p-2 sm:p-4 lg:pl-7 text-base sm:text-lg flex flex-col gap-4">
            {/* Title + Wishlist */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl md:text-2xl font-bold leading-tight">{data.name}</h1>
              <button
                onClick={handleWishlist}
                className={`p-2 rounded-full border ${inWishlist ? 'text-red-600 border-red-200 bg-red-50' : 'text-gray-600 border-gray-200 bg-white'} hover:shadow`}
                aria-label="Wishlist"
                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {inWishlist ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
            <div className="flex items-center justify-between">
  <h1 className="text-2xl font-semibold">{data.name}</h1>
  <ShareButton productName={data.name} />
</div>


            {/* Ratings summary */}
            <div className="flex items-center gap-3 text-sm">
              <span className="px-2 py-0.5 rounded bg-green-600 text-white font-semibold">
                {avgRating.toFixed(1)}★
              </span>
              <span className="text-gray-600">{reviews.length} ratings</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">
                    {data.discount}% OFF
                  </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-green-700">
                {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
              </span>
              {data.discount ? (
                <>
                
                  <span className="line-through text-gray-500">{DisplayPriceInRupees(data.price)}</span>
                 
                </>
                
              ) : null}
            </div>

            {/* Delivery & Offers */}
            <div className="bg-gray-50 p-3 rounded-lg border text-sm">
              <p className="font-semibold">Delivery</p>
              <p className="text-gray-600">Get it by <span className="font-semibold text-green-700">Tomorrow, 7 PM</span></p>
              <p className="mt-2 font-semibold">Available Offers</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>10% Instant Discount with eligible Credit Cards</li>
                <li>Free Delivery on first order</li>
                <li>No Cost EMI available</li>
              </ul>
            </div>

            {/* Options */}
            {Array.isArray(data.options) && data.options.length > 0 && (
              <div className="mt-1">
                {data.options.map((opt) => (
                  <div key={opt.name} className="mb-3">
                    <div className="font-semibold mb-2">{opt.name}{opt.name.toLowerCase().includes('size') && ':'}</div>

                    {/* Color Swatches (with optional images) */}
                    {opt.name.toLowerCase() === 'color' && opt.values && opt.values.length > 0 ? (
                      <div className="flex gap-3 flex-wrap">
                        {opt.values.map((val, idx) => {
                          const label = typeof val === 'object' ? val.label : val;
                          const isSelected = selectedOptions[opt.name] === label;
                          const style = typeof val === 'string' ? { background: val.toLowerCase() } : {};
                          return (
                            <div
                              key={label + idx}
                              className={`w-12 h-12 rounded-full border-2 cursor-pointer flex items-center justify-center
                              ${isSelected ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-300'}`}
                              onClick={() => setSelectedOptions(sel => ({ ...sel, [opt.name]: label }))}
                              title={label}
                              style={style}
                            >
                              {typeof val === 'object' && val.image ? (
                                <img src={val.image} alt={label} className="w-10 h-10 object-cover rounded-full" />
                              ) : null}
                              {typeof val === 'object' && !val.image ? label : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : opt.name.toLowerCase().includes('size') ? (
                      <div className="flex gap-2 items-center flex-wrap">
                        {opt.values.map(val => (
                          <button
                            key={val}
                            type="button"
                            className={`w-12 h-12 rounded-lg border text-lg font-semibold transition 
                            ${selectedOptions[opt.name] === val ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                            onClick={() => setSelectedOptions(sel => ({ ...sel, [opt.name]: val }))}
                          >
                            {val}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="ml-2 text-blue-600 underline text-sm"
                          onClick={() => setShowSizeChart(true)}
                        >
                          Size Chart
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        {opt.values.map(val => {
                          const label = typeof val === 'object' ? val.label : val;
                          const isSelected = selectedOptions[opt.name] === label;
                          return (
                            <button
                              key={label}
                              type="button"
                              className={`px-3 py-1 rounded-lg border transition
                              ${isSelected ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                              onClick={() => setSelectedOptions(sel => ({ ...sel, [opt.name]: label }))}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {/* Size Chart Modal */}
                {showSizeChart && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                      <button className="absolute top-2 right-2 text-xl" onClick={() => setShowSizeChart(false)}>&times;</button>
                      <h3 className="text-lg font-bold mb-4">Size Chart</h3>
                      <img src="https://cdn.fcglcdn.com/brainbees/images/sizeChart_v2.jpg" alt="Size Chart" className="w-full h-auto rounded" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <ProductDescription 
  description={data.description}
  highlights={data.highlights || ["Free Delivery", "1 Year Warranty", "Cash on Delivery available"]}
  specifications={data.specifications || { Brand: "ABC", Color: "Black", Material: "Plastic" }}
/>


            {/* Highlights (if available) */}
            {Array.isArray(data.highlights) && data.highlights.length > 0 && (
              <div className="bg-white border rounded-lg p-3">
                <p className="font-semibold mb-1">Highlights</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {data.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}

            {/* Add to Cart/Buy Now */}
            {data.stock === 0 ? (
              <p className="text-lg text-red-500 my-2 w-full">Out of Stock</p>
            ) : (
              <div className="my-2 flex flex-col sm:flex-row gap-2 w-full">
                <AddToCartButton
                  data={data}
                  buttonClassName="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg font-semibold"
                />
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 font-semibold"
                >
                  🛒 Buy Now
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="flex gap-6 mt-1 text-xs sm:text-sm text-gray-600">
              <div className="flex flex-col items-center">
                <span className="text-2xl">🔒</span>
                <span>Secure Payment</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl">↩️</span>
                <span>Easy Returns</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl">✅</span>
                <span>100% Genuine</span>
              </div>
            </div>

            <Divider />

            {/* Specifications */}
            {data.more_details && (
              <div className='text-sm sm:text-base'>
                <span
                  className='font-semibold mb-2 flex items-center gap-2 cursor-pointer select-none'
                  onClick={() => setSpecOpen(v => !v)}
                >
                  Specifications
                  <span className={specOpen ? 'text-red-600 ml-2 text-lg' : 'text-green-600 ml-2 text-lg'}>
                    {specOpen ? '-' : '+'}
                  </span>
                </span>
                {specOpen && (
                  <table className="min-w-full border text-left text-xs sm:text-sm">
                    <tbody>
                      {Object.entries(data.more_details).map(([key, value]) => (
                        <tr key={key} className="border-b">
                          <td className="py-2 px-2 font-medium w-1/3 bg-gray-50">{key}</td>
                          <td className="py-2 px-2">{String(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            <Divider />

            {/* Ratings & Reviews */}
            <div className='my-4'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                <h2 className='font-semibold text-base sm:text-lg'>Ratings & Reviews</h2>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <span className='text-yellow-500 font-bold'>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</span>
                  <span>({avgRating.toFixed(1)} / 5)</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="md:col-span-1 border rounded-lg p-3">
                  {[5,4,3,2,1].map(star => {
                    const count = ratingCounts[star] || 0;
                    const percent = Math.round((count / totalRatings) * 100);
                    return (
                      <div key={star} className="flex items-center gap-2 text-sm mb-2">
                        <span className="w-6">{star}★</span>
                        <div className="flex-1 bg-gray-200 rounded h-2 overflow-hidden">
                          <div className="bg-yellow-500 h-2" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-gray-500 w-10 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="md:col-span-2">
                  {reviews.length === 0 ? (
                    <div className='bg-gray-50 p-4 rounded shadow-sm'>
                      <p className='text-gray-500'>No reviews yet. Be the first to review this product!</p>
                    </div>
                  ) : (
                    <div className='flex flex-col gap-3'>
                      {reviews.map((r, i) => (
                        <div key={i} className='bg-gray-50 p-4 rounded shadow-sm'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='font-semibold text-green-700'>{r.user}</span>
                            <span className='text-xs text-gray-400'>{r.date}</span>
                            {r.rating && (
                              <span className='text-yellow-500 text-sm'>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                            )}
                          </div>
                          {/* Media preview */}
                          {r.media && r.media.length > 0 && (
                            <div className='flex gap-2 mb-2'>
                              {r.media.map((url, idx) =>
                                /\.(mp4|webm|ogg)$/i.test(url) ? (
                                  <video key={idx} src={url} className='w-24 h-16 rounded object-cover' controls />
                                ) : (
                                  <img key={idx} src={url} alt='review media' className='w-16 h-16 rounded object-cover' />
                                )
                              )}
                            </div>
                          )}
                          <p className='text-gray-800 text-sm sm:text-base'>{r.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {user && user._id ? (
                    <form onSubmit={handleReviewSubmit} className='mt-3 flex flex-col gap-2'>
                      <div className="flex items-center gap-2">
                        <label htmlFor="review-rating" className="font-semibold text-sm">Your Rating:</label>
                        <input
                          id="review-rating"
                          type="number"
                          min={1}
                          max={5}
                          value={reviewRating}
                          onChange={e => setReviewRating(Number(e.target.value))}
                          className="w-16 border rounded p-1"
                          required
                        />
                        <span className="text-yellow-500">{'★'.repeat(reviewRating)}{'☆'.repeat(5 - reviewRating)}</span>
                      </div>
                      <textarea
                        className='border rounded p-2 min-h-[60px] resize-y text-sm sm:text-base'
                        placeholder='Write your review here...'
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        required
                      />
                      <button
                        type='submit'
                        className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded self-end disabled:opacity-60 text-xs sm:text-base'
                        disabled={reviewSubmitting || !reviewText.trim() || !reviewRating}
                      >
                        {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  ) : (
                    <div className='text-gray-500 text-sm sm:text-base mt-2'>
                      Please <span className='text-green-700 font-semibold cursor-pointer' onClick={() => navigate('/login')}>login</span> to write a review.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Divider />

            {/* Q & A */}
            <div className='my-4'>
              <div className="flex items-center justify-between mb-2">
                <h2 className='font-semibold text-base sm:text-lg'>Questions & Answers</h2>
              </div>

              {user && user._id ? (
                <form onSubmit={handleQuestionSubmit} className='flex gap-2 mb-4'>
                  <input
                    type="text"
                    className='flex-1 border rounded p-2 text-sm'
                    placeholder='Ask a question about this product...'
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                    required
                  />
                  <button
                    type='submit'
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-60'
                    disabled={questionSubmitting || !questionText.trim()}
                  >
                    {questionSubmitting ? 'Posting...' : 'Ask'}
                  </button>
                </form>
              ) : (
                <div className='text-gray-500 text-sm sm:text-base mb-4'>
                  Please <span className='text-green-700 font-semibold cursor-pointer' onClick={() => navigate('/login')}>login</span> to ask a question.
                </div>
              )}

              {questions.length === 0 ? (
                <div className='bg-gray-50 p-4 rounded shadow-sm mb-2'>
                  <p className='text-gray-500'>No questions yet. Be the first to ask about this product!</p>
                </div>
              ) : (
                <div className='flex flex-col gap-3'>
                  {questions.map((q, i) => (
                    <div key={q._id || i} className='bg-gray-50 p-4 rounded shadow-sm'>
                      <div className='flex items-center gap-2 mb-1'>
                        <span className='font-semibold text-blue-700'>{q.userName}</span>
                        <span className='text-xs text-gray-400'>{q.date?.slice(0,10)}</span>
                      </div>
                      <p className='text-gray-800 text-sm sm:text-base'><span className="font-semibold text-blue-600">Q:</span> {q.text}</p>
                      {q.answer ? (
                        <p className='mt-1 text-sm'><span className="font-semibold text-green-700">A:</span> {q.answer}</p>
                      ) : (
                        <p className='mt-1 text-sm text-gray-500'>No answer yet</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Divider />

            {/* Frequently Bought Together */}
            <div className='my-4'>
              <div className="flex justify-between items-center mb-2">
                <h2 className='font-semibold text-base sm:text-lg'>Frequently Bought Together</h2>
              </div>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                {frequentlyBought.length === 0 ? (
                  <div className='text-gray-400 col-span-full flex items-center justify-center h-24'>No suggestions found.</div>
                ) : (
                  frequentlyBought.map((prod) => (
                    <div
                      key={prod._id}
                      className='bg-white rounded-lg shadow hover:shadow-lg transition p-3 cursor-pointer'
                      onClick={() => navigate(`/product/${prod.name.replace(/\s+/g, '-')}-${prod._id}`)}
                    >
                      <img src={prod.image?.[0]} alt={prod.name} className='w-full h-28 object-contain mb-2 transition-transform duration-200 hover:scale-105' />
                      <p className='text-xs line-clamp-2'>{prod.name}</p>
                      <p className="text-green-700 font-semibold mt-1">
                        {DisplayPriceInRupees(pricewithDiscount(prod.price, prod.discount))}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Divider />

            {/* Similar Products */}
            <div className='my-4'>
              <div className="flex justify-between items-center mb-2">
                <h2 className='font-semibold text-base sm:text-lg'>Similar Products</h2>
                {/* Placeholder View All (navigate to category listing if available) */}
                {similarProducts.length > 0 && (
                  <button
                    className="text-sm text-blue-600"
                    onClick={() => {
                      if (data.category?.[0]) {
                        navigate(`/category/${data.category[0]}`);
                      }
                    }}
                  >
                    View All
                  </button>
                )}
              </div>
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                {similarProducts.length === 0 ? (
                  <div className='text-gray-400 col-span-full flex items-center justify-center h-24'>No similar products found.</div>
                ) : (
                  similarProducts.map((prod) => (
                    <div
                      key={prod._id}
                      className='bg-white rounded-lg shadow hover:shadow-lg transition p-3 cursor-pointer'
                      onClick={() => navigate(`/product/${prod.name.replace(/\s+/g, '-')}-${prod._id}`)}
                    >
                      <img src={prod.image?.[0]} alt={prod.name} className='w-full h-28 object-contain mb-2 transition-transform duration-200 hover:scale-105' />
                      <p className='text-xs line-clamp-2'>{prod.name}</p>
                      <p className="text-green-700 font-semibold mt-1">
                        {DisplayPriceInRupees(pricewithDiscount(prod.price, prod.discount))}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Divider />

            {/* Recently Viewed */}
            <div className='my-4'>
              <h2 className='font-semibold text-base sm:text-lg mb-2'>Recently Viewed</h2>
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                {recentlyViewed.length === 0 ? (
                  <div className='text-gray-400 col-span-full flex items-center justify-center h-24'>No recently viewed products.</div>
                ) : (
                  recentlyViewed.map((prod) => (
                    <div
                      key={prod._id}
                      className='bg-white rounded-lg shadow hover:shadow-lg transition p-3 cursor-pointer'
                      onClick={() => navigate(`/product/${prod.name.replace(/\s+/g, '-')}-${prod._id}`)}
                    >
                      <img src={prod.image?.[0]} alt={prod.name} className='w-full h-28 object-contain mb-2 transition-transform duration-200 hover:scale-105' />
                      <p className='text-xs line-clamp-2'>{prod.name}</p>
                      {'price' in prod && (
                        <p className="text-green-700 font-semibold mt-1">
                          {DisplayPriceInRupees(pricewithDiscount(prod.price, prod.discount))}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sticky Mobile Bottom Bar */}
          {data.stock !== 0 && (
            <div className="fixed bottom-0 left-0 w-full flex sm:hidden bg-white border-t p-2 gap-2 shadow-md z-40">
              <AddToCartButton
                data={data}
                buttonClassName="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold"
              />
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
              >
                Buy Now
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default ProductDisplayPage;
