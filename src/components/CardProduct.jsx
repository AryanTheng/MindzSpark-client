import React, { useEffect, useState } from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link, useNavigate } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'
import PopupBanner from './CofirmBox'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

const CardProduct = ({data}) => {
    const url = `/product/${encodeURIComponent(valideURLConvert(data.name))}-${data._id}`
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate();
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);

    // Check if product is in wishlist on mount
    useEffect(() => {
      setInWishlist(false);
    }, [data._id]);

    const handleBuyNow = (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/checkout?productId=${data._id}`);
    }

    const handleSomeAction = async () => {
      try {
        // ... existing code ...
      } catch (error) {
        if (error?.response?.data?.message === 'Provide token') {
          setShowAuthPopup(true);
        }
        AxiosToastError(error);
      }
    };

    const handleWishlist = async (e) => {
      e.preventDefault();
      e.stopPropagation();
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
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col min-w-40 max-w-60 w-full h-auto border border-gray-100 hover:border-green-200 overflow-hidden">
        {/* Image Container - Fixed aspect ratio */}
        <Link to={url} className="block">
          <div className='w-full aspect-square bg-gray-50 overflow-hidden relative flex items-center justify-center group'>
                <img 
                    src={data.image[0]}
                    alt={data.name}
                    className='object-contain w-full h-full transition-transform duration-200 group-hover:scale-105'
                />
                {/* Wishlist Heart Icon */}
                <button
                  className='absolute top-2 right-2 z-10 text-lg text-red-500 bg-white rounded-full p-1.5 shadow hover:scale-110 transition-transform duration-200'
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {wishlistLoading ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    inWishlist ? <FaHeart /> : <FaRegHeart />
                  )}
                </button>
          </div>
        </Link>

        {/* Content Container - Flexible height */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Category and Discount Tags */}
          <div className='flex items-center gap-2 mb-2 flex-wrap'>
            <div className='rounded text-xs px-2 py-1 text-green-600 bg-green-50 font-medium'>
              {data?.category?.name}
            </div>
            {Boolean(data.discount) && (
              <div className='text-green-600 bg-green-100 px-2 py-1 text-xs rounded-full font-medium'>
                {data.discount}% off
              </div>
            )}
          </div>

          {/* Product Name - Fixed height with line clamping */}
          <Link to={url}>
            <h3 className='font-semibold text-sm lg:text-base text-gray-800 mb-2 line-clamp-2 leading-tight hover:text-green-600 transition-colors'>
              {data.name}
            </h3>
          </Link>

          {/* Unit */}
          <div className='text-xs lg:text-sm text-gray-600 mb-2'>
            {data.unit}
          </div>

          {/* Price and Add to Cart Section - Always at bottom */}
          <div className='mt-auto'>
            {/* Price */}
            <div className='mb-3'>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-green-700 text-base lg:text-lg'>
                  {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                </span>
                {Boolean(data.discount) && (
                  <span className='text-gray-500 line-through text-sm'>
                    {DisplayPriceInRupees(data.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className='w-full'>
              {data.stock === 0 ? (
                <div className='text-red-500 text-sm text-center py-2 font-medium'>
                  Out of stock
                </div>
              ) : (
                <AddToCartButton 
                  data={data} 
                  buttonClassName='w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-colors duration-200 text-sm'
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CardProduct
