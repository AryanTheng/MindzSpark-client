import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight,FaAngleLeft, FaHeart, FaRegHeart } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import { useSelector } from 'react-redux'
import PopupBanner from '../components/CofirmBox'
import { toast } from 'react-hot-toast'

const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data,setData] = useState({
    name : "",
    image : []
  })
  const [image,setImage] = useState(0)
  const [loading,setLoading] = useState(false)
  const imageContainer = useRef()
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB
  const [reviewMedia, setReviewMedia] = useState([]);
  const similarContainer = useRef();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const qaSectionRef = useRef();
  const [notFound, setNotFound] = useState(false);
  const [specOpen, setSpecOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showSizeChart, setShowSizeChart] = useState(false);

  const fetchProductDetails = async()=>{
    try {
        const response = await Axios({
          ...SummaryApi.getProductDetails,
          data : {
            productId : productId 
          }
        })

        const { data : responseData } = response

        if(responseData.success && responseData.data && responseData.data._id){
          // TEMP: Force options for testing
          // responseData.data.options = [
          //   { name: "Size", values: ["S", "M", "L"] },
          //   { name: "Color", values: ["Red", "Blue"] }
          // ];
          setData(responseData.data)
          setNotFound(false)
        } else {
          setNotFound(true)
        }
    } catch (error) {
      if (error?.response?.data?.message === 'Provide token') {
        setShowAuthPopup(true);
      }
      setNotFound(true);
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchProductDetails()
  },[params])
  
  const handleScrollRight = ()=>{
    imageContainer.current.scrollLeft += 100
  }
  const handleScrollLeft = ()=>{
    imageContainer.current.scrollLeft -= 100
  }
  console.log("product data",data)

  const handleBuyNow = () => {
    navigate(`/checkout?productId=${data._id}`);
  };

  // Fetch reviews on load (mocked for now)
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
            date: r.date.slice(0, 10),
            rating: r.rating,
            media: r.media || [],
          })));
        }
      } catch (err) {
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
      // Optionally show error
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.type.startsWith('image/')) {
        return file.size <= MAX_IMAGE_SIZE;
      }
      if (file.type.startsWith('video/')) {
        return file.size <= MAX_VIDEO_SIZE;
      }
      return false;
    });
    if (validFiles.length !== files.length) {
      alert('Some files were too large and were not added (max 2MB for images, 10MB for videos).');
    }
    setReviewMedia(validFiles);
  };

  // Check if product is in wishlist on mount (optional: can be improved with global state)
  useEffect(() => {
    setInWishlist(false);
  }, [data._id]);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (wishlistLoading) return;
    setWishlistLoading(true);
    try {
      if (!inWishlist) {
        await Axios({
          ...SummaryApi.addToWishlist,
          data: { productId: data._id },
        });
        setInWishlist(true);
        toast.success('Added to wishlist');
      } else {
        await Axios({
          ...SummaryApi.removeFromWishlist,
          data: { productId: data._id },
        });
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

  const handleSimilarScrollLeft = () => {
    if (similarContainer.current) similarContainer.current.scrollLeft -= 200;
  };
  const handleSimilarScrollRight = () => {
    if (similarContainer.current) similarContainer.current.scrollLeft += 200;
  };

  useEffect(() => {
    // Fetch similar products when product data is loaded and has a category
    const fetchSimilar = async () => {
      if (data.category && data.category[0]) {
        try {
          const response = await Axios({
            ...SummaryApi.getProductByCategory,
            data: { id: data.category[0] },
          });
          if (response.data.success) {
            setSimilarProducts(
              response.data.data.filter((p) => p._id !== data._id)
            );
          }
        } catch (err) {
          setSimilarProducts([]);
        }
      }
    };
    fetchSimilar();
  }, [data.category, data._id]);

  useEffect(() => {
    // Fetch frequently bought together products (same category, exclude current)
    const fetchFrequentlyBought = async () => {
      if (data.category && data.category[0]) {
        try {
          const response = await Axios({
            ...SummaryApi.getProductByCategory,
            data: { id: data.category[0] },
          });
          if (response.data.success) {
            setFrequentlyBought(
              response.data.data.filter((p) => p._id !== data._id).slice(0, 3)
            );
          }
        } catch (err) {
          setFrequentlyBought([]);
        }
      }
    };
    fetchFrequentlyBought();
  }, [data.category, data._id]);

  useEffect(() => {
    if (!data._id) return;
    // Get and update recently viewed from localStorage
    let viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    viewed = viewed.filter(id => id !== data._id); // Remove current if present
    viewed.unshift(data._id); // Add current to front
    if (viewed.length > 10) viewed = viewed.slice(0, 10); // Keep max 10
    localStorage.setItem('recentlyViewed', JSON.stringify(viewed));

    // Fetch details for recently viewed (excluding current)
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

  // Fetch questions for this product
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
      // Optionally show error
    } finally {
      setQuestionSubmitting(false);
    }
  };

  // After fetching product details and before rendering, ensure options is always present for demo
  // Remove the forced default options array. Only show options if present in data.

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
      ) : (
      <section className="container mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Images and Gallery */}
        <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md lg:w-full mx-auto lg:h-[80vh] lg:overflow-y-auto lg:sticky lg:top-24">
          <div className="bg-white rounded min-h-40 max-h-72 sm:min-h-56 sm:max-h-96 h-full w-full flex items-center justify-center mx-auto">
            <img
              src={data.image[image]}
              className="w-full h-full max-h-72 sm:max-h-96 object-contain mx-auto"
              alt={data.name}
            />
          </div>
          <div className='flex items-center justify-center gap-2 my-2'>
            {data.image.map((img, index) => (
              <div key={img + index + "point"} className={`bg-slate-200 w-2 h-2 sm:w-3 sm:h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-300"}`}></div>
            ))}
          </div>
          <div className='grid relative'>
            <div ref={imageContainer} className='flex gap-2 sm:gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
              {data.image.map((img, index) => (
                <div className='w-16 h-16 sm:w-20 sm:h-20 min-h-16 min-w-16 sm:min-h-20 sm:min-w-20 cursor-pointer shadow-md' key={img + index}>
                  <img
                    src={img}
                    alt='min-product'
                    onClick={() => setImage(index)}
                    className='w-full h-full object-contain'
                  />
                </div>
              ))}
            </div>
            <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center'>
              <button onClick={handleScrollLeft} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
                <FaAngleLeft />
              </button>
              <button onClick={handleScrollRight} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
                <FaAngleRight />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="w-full max-w-xs sm:max-w-sm lg:max-w-2xl lg:w-full mx-auto mt-8 p-2 sm:p-4 lg:pl-7 text-base sm:text-lg flex flex-col gap-4">
          {/* Title and Seller Info */}
          <div className="mb-2 mt-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold break-words leading-tight">{data.name}</h1>
          </div>
          {/* Ratings & Reviews Summary */}
          <div className='flex items-center gap-2 sm:gap-3 mb-2'>
            <span className='text-yellow-500 font-bold text-base sm:text-lg'>★★★★☆</span>
            <span className='text-gray-600 text-xs sm:text-base'>(4.2/5)</span>
            <span className='text-gray-500 hidden sm:inline'>|</span>
            <span className='text-blue-600 cursor-pointer text-xs sm:text-base'>123 ratings</span>
          </div>
          {/* Price */}
          <div className='mb-2'>
            <span className='text-xl sm:text-2xl font-bold text-green-700'>{DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}</span>
            {data.discount && (
              <span className='ml-2 line-through text-gray-400 text-sm sm:text-base'>{DisplayPriceInRupees(data.price)}</span>
            )}
            {data.discount && (
              <span className='ml-2 text-green-600 font-semibold text-sm sm:text-base'>{data.discount}% OFF</span>
            )}
          </div>
          {/* Debug: log product options */}
          {console.log('Product options:', data.options)}
          {/* Product Options Selection (Flipkart style) */}
          {Array.isArray(data.options) && data.options.length > 0 && (
            <div className="mb-2">
              {data.options.map((opt, idx) => (
                <div key={opt.name} className="mb-4 flex items-center gap-4 flex-wrap">
                  <div className="font-semibold mb-1 min-w-[80px]">{opt.name}{opt.name.toLowerCase().includes('size') && ':'}</div>
                  {/* Color as image swatches if possible */}
                  {opt.name.toLowerCase() === 'color' && opt.values && opt.values.length > 0 && typeof opt.values[0] === 'object' && opt.values[0].image ? (
                    <div className="flex gap-3">
                      {opt.values.map(val => (
                        <div
                          key={val.label}
                          className={`w-12 h-12 rounded border-2 cursor-pointer flex items-center justify-center ${selectedOptions[opt.name] === val.label ? 'border-blue-600' : 'border-gray-300'}`}
                          onClick={() => setSelectedOptions(sel => ({ ...sel, [opt.name]: val.label }))}
                          title={val.label}
                        >
                          <img src={val.image} alt={val.label} className="w-10 h-10 object-cover rounded" />
                        </div>
                      ))}
                    </div>
                  ) : opt.name.toLowerCase() === 'color' ? (
                    <div className="flex gap-3">
                      {opt.values.map(val => (
                        <div
                          key={typeof val === 'object' ? val.label : val}
                          className={`w-12 h-12 rounded border-2 cursor-pointer flex items-center justify-center ${selectedOptions[opt.name] === (typeof val === 'object' ? val.label : val) ? 'border-blue-600' : 'border-gray-300'}`}
                          onClick={() => setSelectedOptions(sel => ({ ...sel, [opt.name]: typeof val === 'object' ? val.label : val }))}
                          style={{ background: typeof val === 'string' ? val.toLowerCase() : undefined }}
                          title={typeof val === 'object' ? val.label : val}
                        >
                          {typeof val === 'object' ? val.label : val}
                        </div>
                      ))}
                    </div>
                  ) : opt.name.toLowerCase().includes('size') ? (
                    <div className="flex gap-2 items-center">
                      {opt.values.map(val => (
                        <button
                          key={val}
                          type="button"
                          className={`w-12 h-12 rounded border text-lg font-semibold ${selectedOptions[opt.name] === val ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300'} hover:bg-blue-100`}
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
                      {opt.values.map(val => (
                        <button
                          key={typeof val === 'object' ? val.label : val}
                          type="button"
                          className={`px-3 py-1 rounded border ${selectedOptions[opt.name] === (typeof val === 'object' ? val.label : val) ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300'} hover:bg-blue-100`}
                          onClick={() => setSelectedOptions(sel => ({ ...sel, [opt.name]: typeof val === 'object' ? val.label : val }))}
                        >
                          {typeof val === 'object' ? val.label : val}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {/* Size Chart Modal */}
              {showSizeChart && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                    <button className="absolute top-2 right-2 text-xl" onClick={() => setShowSizeChart(false)}>&times;</button>
                    <h3 className="text-lg font-bold mb-4">Size Chart</h3>
                    {/* Replace the src below with your actual size chart image or table */}
                    <img src="https://cdn.fcglcdn.com/brainbees/images/sizeChart_v2.jpg" alt="Size Chart" className="w-full h-auto rounded" />
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Description with Read More */}
           <div className='mb-2 text-sm sm:text-base'>
            <span className='font-semibold'>Description: </span>
            {showFullDescription ? data.description : (data.description?.slice(0, 120) || '')}
            {data.description && data.description.length > 120 && (
              <button className='ml-2 text-blue-600 underline' onClick={() => setShowFullDescription(v => !v)}>
                {showFullDescription ? 'Read Less' : 'Read More'}
              </button>
            )}
          </div>
          
          {/* Add to Cart/Buy Now */}
          {data.stock === 0 ? (
            <p className='text-lg text-red-500 my-2 w-full'>Out of Stock</p>
          ) : (
            <div className='my-4 flex flex-col sm:flex-row gap-2 w-full'>
              <AddToCartButton data={data} buttonClassName='flex-1' />
              <button onClick={handleBuyNow} className='flex-1 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600'>Buy Now</button>
            </div>
          )}
          {/* Seller Info at Bottom */}
          <div className="flex items-center gap-2 text-sm text-gray-700 mt-4">
            <span>Seller:</span>
            <span className="font-semibold">{data.seller || 'MISSPERFECT143'}</span>
            <span className="ml-2 text-yellow-500 font-bold">{data.sellerRating || 4.5}★</span>
            <span className="text-xs text-gray-500">({data.sellerRatingCount || 1} ratings)</span>
          </div>
          <Divider />
          {/* Frequently Bought Together */}
          <div className='my-6'>
            <h2 className='font-semibold text-base sm:text-lg mb-2'>Frequently Bought Together</h2>
            <div className='-mx-2 px-2 flex gap-3 sm:gap-4 overflow-x-auto pb-2 min-w-0'>
              {frequentlyBought.length === 0 ? (
                <div className='text-gray-400 flex items-center justify-center h-40'>No suggestions found.</div>
              ) : (
                frequentlyBought.map((prod) => (
                  <div key={prod._id} className='min-w-[140px] sm:min-w-[160px] h-40 sm:h-56 bg-gray-100 rounded flex flex-col items-center justify-center cursor-pointer hover:shadow' onClick={() => navigate(`/product/${prod.name.replace(/\s+/g, '-')}-${prod._id}`)}>
                    <img src={prod.image[0]} alt={prod.name} className='w-20 h-20 object-contain mb-2' />
                    <span className='text-xs text-center px-1'>{prod.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Specifications Table - Collapsible with + icon */}
          {data.more_details && (
            <div className='mb-2 text-sm sm:text-base'>
              <span className='font-semibold block mb-2 flex items-center gap-2 cursor-pointer select-none' onClick={() => setSpecOpen(v => !v)}>
                Specifications:
                <span className={specOpen ? 'text-red-600 ml-20 text-lg' : 'text-green-600 ml-20 text-lg'}>{specOpen ? '-' : '+'}</span>
              </span>
              {specOpen && (
                <table className="min-w-full border text-left text-xs sm:text-sm animate-fade-in">
                  <tbody>
                    {Object.entries(data.more_details).map(([key, value]) => (
                      <tr key={key} className="border-b">
                        <td className="py-1 px-2 font-medium w-1/3 bg-gray-50">{key}</td>
                        <td className="py-1 px-2">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          <Divider />
          {/* Ratings & Reviews Section */}
          <div className='my-8'>
            <h2 className='font-semibold text-base sm:text-lg mb-2'>Ratings & Reviews</h2>
            <div className='mb-4 flex items-center gap-2 sm:gap-4'>
              <span className='text-yellow-500 font-bold text-base sm:text-lg'>★★★★☆</span>
              <span className='text-gray-600 text-xs sm:text-base'>(4.2/5 from 123 ratings)</span>
              <button className='ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs sm:text-base'>Add Rating</button>
            </div>
            {reviews.length === 0 ? (
              <div className='bg-gray-50 p-4 rounded shadow mb-4'>
                <p className='text-gray-500'>No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className='flex flex-col gap-3 mb-4'>
                {reviews.map((r, i) => (
                  <div key={i} className='bg-gray-50 p-4 rounded shadow'>
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
                          url.match(/\\.(mp4|webm|ogg)$/i) ? (
                            <video key={idx} src={url} className='w-20 h-16 rounded object-cover' controls />
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
              <form onSubmit={handleReviewSubmit} className='flex flex-col gap-2'>
                <div className="flex items-center gap-2">
                  <label htmlFor="review-rating" className="font-semibold">Your Rating:</label>
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
                  <span className="text-yellow-500">{'★'.repeat(reviewRating)}</span>
                </div>
                <textarea
                  className='border rounded p-2 min-h-[60px] resize-y text-sm sm:text-base'
                  placeholder='Write your review here...'
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  required
                />
                {/* <div className='flex gap-2'>
                  <input
                    type='file'
                    accept='image/*,video/*'
                    multiple
                    onChange={handleMediaChange}
                    className='border rounded p-1'
                  />
                  <span className='text-xs text-gray-400'>(Max 2MB/image, 10MB/video)</span>
                </div> */}
                <button
                  type='submit'
                  className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded self-end disabled:opacity-60 text-xs sm:text-base'
                  disabled={reviewSubmitting || !reviewText.trim() || !reviewRating}
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className='text-gray-500 text-sm sm:text-base'>
                Please <span className='text-green-700 font-semibold cursor-pointer' onClick={() => navigate('/login')}>login</span> to write a review.
              </div>
            )}
          </div>
          <Divider />
          {/* Questions and Answers Section */}
          <div className='my-8' ref={qaSectionRef}>
            <h2 className='font-semibold text-base sm:text-lg mb-2'>Questions & Answers</h2>
            {/* Post a question form */}
            {user && user._id ? (
              <form onSubmit={handleQuestionSubmit} className='flex flex-col gap-2 mb-4'>
                <textarea
                  className='border rounded p-2 min-h-[40px] resize-y text-sm sm:text-base'
                  placeholder='Ask a question about this product...'
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  required
                />
                <button
                  type='submit'
                  className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded self-end disabled:opacity-60 text-xs sm:text-base'
                  disabled={questionSubmitting || !questionText.trim()}
                >
                  {questionSubmitting ? 'Posting...' : 'Post Question'}
                </button>
              </form>
            ) : (
              <div className='text-gray-500 text-sm sm:text-base mb-4'>
                Please <span className='text-green-700 font-semibold cursor-pointer' onClick={() => navigate('/login')}>login</span> to ask a question.
              </div>
            )}
            {/* List of questions */}
            {questions.length === 0 ? (
              <div className='bg-gray-50 p-4 rounded shadow mb-4'>
                <p className='text-gray-500'>No questions yet. Be the first to ask about this product!</p>
              </div>
            ) : (
              <div className='flex flex-col gap-3 mb-4'>
                {questions.map((q, i) => (
                  <div key={q._id || i} className='bg-gray-50 p-4 rounded shadow'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-semibold text-blue-700'>{q.userName}</span>
                      <span className='text-xs text-gray-400'>{q.date?.slice(0, 10)}</span>
                    </div>
                    <p className='text-gray-800 text-sm sm:text-base'>{q.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Divider />
          {/* Similar Products */}
          <div className='my-8'>
            <h2 className='font-semibold text-base sm:text-lg mb-2'>Similar Products</h2>
            <div className='relative'>
              <div ref={similarContainer} className='-mx-2 px-2 flex gap-3 sm:gap-4 overflow-x-auto pb-2 min-w-0 scrollbar-none'>
                {similarProducts.length === 0 ? (
                  <div className='text-gray-400 flex items-center justify-center h-40'>No similar products found.</div>
                ) : (
                  similarProducts.map((prod) => (
                    <div key={prod._id} className='min-w-[140px] sm:min-w-[160px] h-40 sm:h-56 bg-gray-100 rounded flex flex-col items-center justify-center cursor-pointer hover:shadow' onClick={() => navigate(`/product/${prod.name.replace(/\s+/g, '-')}-${prod._id}`)}>
                      <img src={prod.image[0]} alt={prod.name} className='w-20 h-20 object-contain mb-2' />
                      <span className='text-xs text-center px-1'>{prod.name}</span>
                    </div>
                  ))
                )}
              </div>
              <div className='w-full h-full hidden lg:flex justify-between absolute top-0 items-center pointer-events-none'>
                <button onClick={handleSimilarScrollLeft} className='z-10 bg-white relative p-1 rounded-full shadow-lg pointer-events-auto'>
                  <FaAngleLeft />
                </button>
                <button onClick={handleSimilarScrollRight} className='z-10 bg-white relative p-1 rounded-full shadow-lg pointer-events-auto'>
                  <FaAngleRight />
                </button>
              </div>
            </div>
          </div>
          <Divider />
          {/* Recently Viewed */}
          <div className='my-8'>
            <h2 className='font-semibold text-base sm:text-lg mb-2'>Recently Viewed</h2>
            <div className='-mx-2 px-2 flex gap-3 sm:gap-4 overflow-x-auto pb-2 min-w-0'>
              {recentlyViewed.length === 0 ? (
                <div className='text-gray-400 flex items-center justify-center h-40'>No recently viewed products.</div>
              ) : (
                recentlyViewed.map((prod) => (
                  <div key={prod._id} className='min-w-[140px] sm:min-w-[160px] h-40 sm:h-56 bg-gray-100 rounded flex flex-col items-center justify-center cursor-pointer hover:shadow' onClick={() => navigate(`/product/${prod.name.replace(/\s+/g, '-')}-${prod._id}`)}>
                    <img src={prod.image[0]} alt={prod.name} className='w-20 h-20 object-contain mb-2' />
                    <span className='text-xs text-center px-1'>{prod.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      )}
    </>
  )
}

export default ProductDisplayPage
