import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import CardProduct from '../components/CardProduct';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.getWishlist,
      });
      if (response.data.success) {
        setWishlist(response.data.data || []);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Optionally, handle removal from wishlist and refresh
  const handleRemove = async (productId) => {
    try {
      await Axios({
        ...SummaryApi.removeFromWishlist,
        data: { productId },
      });
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      {loading ? (
        <div>Loading...</div>
      ) : wishlist.length === 0 ? (
        <div className="text-gray-500">Your wishlist is empty.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <div key={product._id} className="relative">
              <CardProduct data={product} />
              <button
                className="absolute top-2 left-2 bg-white text-red-500 rounded-full p-1 shadow text-xs"
                onClick={() => handleRemove(product._id)}
                aria-label="Remove from wishlist"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist; 