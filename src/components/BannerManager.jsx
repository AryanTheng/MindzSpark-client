import React, { useState, useEffect } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await Axios.get('/api/banner');
      setBanners(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please select an image');
      return;
    }
    const formData = new FormData();
    formData.append('image', image);
    if (caption) formData.append('caption', caption);
    if (link) formData.append('link', link);
    try {
      setLoading(true);
      await Axios.post('/api/banner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Banner uploaded!');
      setImage(null);
      setCaption('');
      setLink('');
      fetchBanners();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      setLoading(true);
      await Axios.delete(`/api/banner/${id}`);
      toast.success('Banner deleted');
      fetchBanners();
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Hero Banner Manager</h2>
      <form onSubmit={handleUpload} className="bg-white p-4 rounded shadow mb-8 flex flex-col gap-4">
        <div>
          <label className="block font-semibold mb-1">Banner Image *</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Caption</label>
          <input type="text" value={caption} onChange={e => setCaption(e.target.value)} className="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Link</label>
          <input type="text" value={link} onChange={e => setLink(e.target.value)} className="w-full border rounded px-2 py-1" />
        </div>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Banner'}
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-2">Existing Banners</h3>
      {loading && <div>Loading...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map(banner => (
          <div key={banner._id} className="bg-white rounded shadow flex flex-col md:flex-row items-center gap-4 p-4">
            <img src={banner.image} alt={banner.caption} className="w-40 h-24 object-cover rounded" />
            <div className="flex-1">
              <div className="font-semibold">{banner.caption}</div>
              {banner.link && <a href={banner.link} className="text-blue-600 text-sm" target="_blank" rel="noopener noreferrer">{banner.link}</a>}
              <div className="text-xs text-gray-500 mt-1">Uploaded: {new Date(banner.createdAt).toLocaleString()}</div>
            </div>
            <button onClick={() => handleDelete(banner._id)} className="text-red-600 hover:text-red-800 font-bold">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerManager;