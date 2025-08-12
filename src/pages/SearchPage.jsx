import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation, useNavigate } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'
import { useCompare } from '../provider/CompareProvider'

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
  { label: 'Above ₹5000', min: 5000, max: Infinity },
];
const discountRanges = [
  { label: '10% or more', value: 10 },
  { label: '20% or more', value: 20 },
  { label: '30% or more', value: 30 },
  { label: '40% or more', value: 40 },
  { label: '50% or more', value: 50 },
];

const SearchPage = () => {
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [page,setPage] = useState(1)
  const [totalPage,setTotalPage] = useState(1)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [selectedPrice, setSelectedPrice] = useState(null)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [selectedDiscount, setSelectedDiscount] = useState([])
  const [excludeOutOfStock, setExcludeOutOfStock] = useState(false)
  const [newArrivals, setNewArrivals] = useState(false)
  // Placeholders for future fields
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [offersOnly, setOffersOnly] = useState(false)
  const [gstInvoice, setGstInvoice] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const params = useLocation()
  const searchText = params?.search?.slice(3)
  const [sortOption, setSortOption] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const { compareList, addToCompare, removeFromCompare, clearCompare } = useCompare();
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const navigate = useNavigate();

  // Add filterDraft state to hold temporary filter values
  const [filterDraft, setFilterDraft] = useState({
    selectedCategory: '',
    selectedSubCategory: '',
    selectedPrice: null,
    minPrice: '',
    maxPrice: '',
    selectedDiscount: [],
    excludeOutOfStock: false,
    newArrivals: false,
    selectedBrand: '',
    selectedRating: '',
    offersOnly: false,
    gstInvoice: false,
  });

  // Sync filterDraft with actual filter state when filters are applied
  useEffect(() => {
    setFilterDraft({
      selectedCategory,
      selectedSubCategory,
      selectedPrice,
      minPrice,
      maxPrice,
      selectedDiscount,
      excludeOutOfStock,
      newArrivals,
      selectedBrand,
      selectedRating,
      offersOnly,
      gstInvoice,
    });
  }, []);

  // Update subcategories when filterDraft.selectedCategory changes
  useEffect(() => {
    if (!filterDraft.selectedCategory) {
      setSubCategories([]);
      setFilterDraft((draft) => ({ ...draft, selectedSubCategory: '' }));
      return;
    }
    const fetchSubCategories = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.getSubCategory,
          data: { categoryId: filterDraft.selectedCategory },
        });
        if (response.data.success) {
          setSubCategories(response.data.data);
        }
      } catch (error) {}
    };
    fetchSubCategories();
  }, [filterDraft.selectedCategory]);

  // Only apply filters when Apply button is clicked
  const handleApplyFilters = () => {
    setSelectedCategory(filterDraft.selectedCategory);
    setSelectedSubCategory(filterDraft.selectedSubCategory);
    setSelectedPrice(filterDraft.selectedPrice);
    setMinPrice(filterDraft.minPrice);
    setMaxPrice(filterDraft.maxPrice);
    setSelectedDiscount(filterDraft.selectedDiscount);
    setExcludeOutOfStock(filterDraft.excludeOutOfStock);
    setNewArrivals(filterDraft.newArrivals);
    setSelectedBrand(filterDraft.selectedBrand);
    setSelectedRating(filterDraft.selectedRating);
    setOffersOnly(filterDraft.offersOnly);
    setGstInvoice(filterDraft.gstInvoice);
    setPage(1); // Ensure filters are applied immediately
    setShowFilters(false); // Auto-hide filter sidebar on mobile
  };

  // Update filterDraft on change
  const updateDraft = (field, value) => {
    setFilterDraft((draft) => ({ ...draft, [field]: value }));
  };
  const updateDraftDiscount = (value) => {
    setFilterDraft((draft) => ({
      ...draft,
      selectedDiscount: draft.selectedDiscount.includes(value)
        ? draft.selectedDiscount.filter((v) => v !== value)
        : [...draft.selectedDiscount, value],
    }));
  };

  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Axios({ ...SummaryApi.getCategory });
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchCategories();
  }, []);

  const fetchData = async() => {
    try {
      setLoading(true)
      const filterData = {
        search: searchText,
        page: page,
      };
      // Price filter logic
      if (selectedPrice && !minPrice && !maxPrice) {
        filterData.minPrice = selectedPrice.min;
        filterData.maxPrice = selectedPrice.max === Infinity ? 999999 : selectedPrice.max;
      }
      if (minPrice) filterData.minPrice = minPrice;
      if (maxPrice) filterData.maxPrice = maxPrice;
      if (selectedCategory) filterData.category = selectedCategory;
      if (selectedSubCategory) filterData.subCategory = selectedSubCategory;
      if (selectedDiscount.length > 0) filterData.discount = Math.max(...selectedDiscount);
      if (excludeOutOfStock) filterData.inStock = true;
      if (newArrivals) filterData.newArrivals = true;
      if (selectedBrand) filterData.brand = selectedBrand;
      if (selectedRating) filterData.rating = selectedRating;
      if (offersOnly) filterData.offers = true;
      if (gstInvoice) filterData.gstInvoice = true;
      if (sortOption) filterData.sort = sortOption;
      console.log('Sending filterData:', filterData); // Debug log
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: filterData,
      })
      const { data : responseData } = response
      if(responseData.success){
        if(responseData.page == 1){
          setData(responseData.data)
        }else{
          setData((preve)=>{
            return[
              ...preve,
              ...responseData.data
            ]
          })
        }
        setTotalPage(responseData.totalPage)
      }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    setPage(1); // Reset to first page on filter/search or sort change
  }, [searchText, selectedCategory, selectedSubCategory, selectedPrice, minPrice, maxPrice, selectedDiscount, excludeOutOfStock, newArrivals, selectedBrand, selectedRating, offersOnly, gstInvoice, sortOption]);

  useEffect(()=>{
    fetchData()
  },[page,searchText,selectedCategory,selectedSubCategory,selectedPrice,minPrice,maxPrice,selectedDiscount,excludeOutOfStock,newArrivals,selectedBrand,selectedRating,offersOnly,gstInvoice,sortOption])

  const handleDiscountChange = (value) => {
    setSelectedDiscount((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage((prev) => prev + 1);
    }
  };

  const handleCompareToggle = () => {
    setCompareMode((prev) => !prev);
    setSelectedForCompare([]);
    clearCompare();
  };

  const handleProductSelect = (product) => {
    setSelectedForCompare((prev) => {
      if (prev.find((p) => p._id === product._id)) {
        return prev.filter((p) => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleCompareNow = () => {
    // Optionally, store selectedForCompare in context or localStorage
    clearCompare();
    selectedForCompare.forEach(addToCompare);
    navigate('/compare');
  };

  // UpdateDraft for price range radio
  const handlePriceRangeChange = (range) => {
    updateDraft('selectedPrice', range);
    updateDraft('minPrice', '');
    updateDraft('maxPrice', '');
  };
  // UpdateDraft for manual min/max
  const handleMinPriceChange = (e) => {
    updateDraft('minPrice', e.target.value);
    updateDraft('selectedPrice', null);
  };
  const handleMaxPriceChange = (e) => {
    updateDraft('maxPrice', e.target.value);
    updateDraft('selectedPrice', null);
  };

  // Filter UI
  const FilterSidebar = () => (
    <aside className={`w-full sm:w-64 bg-gray-50 p-4 rounded shadow mb-4 sm:mb-0 sm:mr-4 max-h-[90vh] overflow-y-auto ${showFilters ? 'fixed top-0 left-0 right-0 bottom-0 z-50 bg-white' : ''}`}>
      {/* Mobile close button */}
      {showFilters && (
        <button
          className='sm:hidden absolute top-2 right-2 text-2xl font-bold text-gray-700 bg-white rounded-full p-2 shadow'
          onClick={() => setShowFilters(false)}
          aria-label='Close filter sidebar'
        >
          ×
        </button>
      )}
      <h3 className='font-bold mb-2'>Filters</h3>
      {/* Categories */}
      <div className='mb-4'>
        <h4 className='font-semibold mb-1'>CATEGORIES</h4>
        <ul>
          <li>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='category'
                checked={filterDraft.selectedCategory === ''}
                onChange={() => updateDraft('selectedCategory', '')}
              />
              All
            </label>
          </li>
          {categories.map((cat) => (
            <li key={cat._id}>
              <label className='flex items-center gap-2'>
                <input
                  type='radio'
                  name='category'
                  checked={filterDraft.selectedCategory === cat._id}
                  onChange={() => updateDraft('selectedCategory', cat._id)}
                />
                {cat.name}
              </label>
              {/* Subcategories */}
              {filterDraft.selectedCategory === cat._id && subCategories.length > 0 && (
                <ul className='ml-6 mt-1'>
                  <li>
                    <label className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='subcategory'
                        checked={filterDraft.selectedSubCategory === ''}
                        onChange={() => updateDraft('selectedSubCategory', '')}
                      />
                      All
                    </label>
                  </li>
                  {subCategories.map((sub) => (
                    <li key={sub._id}>
                      <label className='flex items-center gap-2'>
                        <input
                          type='radio'
                          name='subcategory'
                          checked={filterDraft.selectedSubCategory === sub._id}
                          onChange={() => updateDraft('selectedSubCategory', sub._id)}
                        />
                        {sub.name}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* Price */}
      <div className='mb-4'>
        <h4 className='font-semibold mb-1'>Price</h4>
        <div className='flex gap-2 mb-2'>
          <input
            type='number'
            placeholder='Min'
            className='w-20 p-1 border rounded'
            value={filterDraft.minPrice}
            onChange={handleMinPriceChange}
            min={0}
          />
          <span>to</span>
          <input
            type='number'
            placeholder='Max'
            className='w-20 p-1 border rounded'
            value={filterDraft.maxPrice}
            onChange={handleMaxPriceChange}
            min={0}
          />
        </div>
        <ul>
          <li>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='price'
                checked={filterDraft.selectedPrice === null}
                onChange={() => handlePriceRangeChange(null)}
              />
              All
            </label>
          </li>
          {priceRanges.map((range, idx) => (
            <li key={idx}>
              <label className='flex items-center gap-2'>
                <input
                  type='radio'
                  name='price'
                  checked={filterDraft.selectedPrice === range}
                  onChange={() => handlePriceRangeChange(range)}
                />
                {range.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
      {/* Discount */}
      <div className='mb-4'>
        <h4 className='font-semibold mb-1'>Discount</h4>
        <ul>
          {discountRanges.map((range, idx) => (
            <li key={idx}>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={filterDraft.selectedDiscount.includes(range.value)}
                  onChange={() => updateDraftDiscount(range.value)}
                />
                {range.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
      {/* Customer Ratings (placeholder) */}
      <div className='mb-4'>
        <h4 className='font-semibold mb-1'>Customer Ratings</h4>
        <ul>
          <li><label className='flex items-center gap-2'><input type='radio' name='rating' disabled />4★ & above</label></li>
          <li><label className='flex items-center gap-2'><input type='radio' name='rating' disabled />3★ & above</label></li>
          <li><label className='flex items-center gap-2'><input type='radio' name='rating' disabled />2★ & above</label></li>
          <li><label className='flex items-center gap-2'><input type='radio' name='rating' disabled />1★ & above</label></li>
        </ul>
      </div>
      {/* Brand (placeholder) */}
      <div className='mb-4'>
        <h4 className='font-semibold mb-1'>Brand</h4>
        <ul>
          <li><label className='flex items-center gap-2'><input type='checkbox' disabled />Brand 1</label></li>
          <li><label className='flex items-center gap-2'><input type='checkbox' disabled />Brand 2</label></li>
        </ul>
      </div>
      {/* Offers (placeholder) */}
      <div className='mb-4'>
        <h4 className='font-semibold mb-1'>Offers</h4>
        <label className='flex items-center gap-2'><input type='checkbox' disabled />Offers only</label>
      </div>
      {/* Availability */}
      <div className='mb-4'>
        <h4 className='font-semibold mb-1'>Availability</h4>
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={filterDraft.excludeOutOfStock}
            onChange={() => updateDraft('excludeOutOfStock', !filterDraft.excludeOutOfStock)}
          />
          Exclude Out of Stock
        </label>
      </div>
      {/* GST Invoice (placeholder) */}
      <div className='mb-4'>
        <h4 className='font-semibold mb-1'>GST Invoice Available</h4>
        <label className='flex items-center gap-2'><input type='checkbox' disabled />GST Invoice Available</label>
      </div>
      {/* New Arrivals */}
      <div className='mb-4'>
        <h4 className='font-semibold mb-1'>New Arrivals</h4>
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={filterDraft.newArrivals}
            onChange={() => updateDraft('newArrivals', !filterDraft.newArrivals)}
          />
          Show only new arrivals
        </label>
      </div>
      <button
        className='w-full bg-primary-200 text-white py-2 rounded font-semibold mt-2 shadow hover:bg-primary-300 transition'
        onClick={handleApplyFilters}
        type='button'
      >
        Apply Filters
      </button>
    </aside>
  );

  // Helper to check if any filter is active
  const isAnyFilterActive = () => {
    return !!(
      selectedCategory ||
      selectedSubCategory ||
      selectedPrice ||
      minPrice ||
      maxPrice ||
      selectedDiscount.length > 0 ||
      excludeOutOfStock ||
      newArrivals
    );
  };

  return (
    <section className='bg-white'>
      <div className='container mx-auto p-4'>
        <div className='flex flex-col sm:flex-row'>
          {/* Top bar for mobile: Sort and Filter */}
          <div className='sm:hidden flex justify-end items-center gap-6 mb-2 w-full relative'>
            {/* Sort Button */}
            <button
              className='flex items-center gap-1 font-semibold text-gray-700 relative'
              onClick={() => setShowSortMenu((prev) => !prev)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h2.25M3 7.5V5.25A2.25 2.25 0 015.25 3h2.25m9 0h2.25A2.25 2.25 0 0121 5.25V7.5m0 9v2.25A2.25 2.25 0 0118.75 21h-2.25M21 7.5V5.25A2.25 2.25 0 0018.75 3h-2.25m-9 0H5.25A2.25 2.25 0 003 5.25V7.5m0 9v2.25A2.25 2.25 0 005.25 21h2.25" />
              </svg>
              Sort{sortOption ? `: ${sortOption === 'priceLowToHigh' ? 'Low to High' : sortOption === 'priceHighToLow' ? 'High to Low' : 'Newest First'}` : ''}
            </button>
            {/* Sort Dropdown */}
            {showSortMenu && (
              <div className='absolute top-10 right-0 bg-white border rounded shadow-md z-50 w-40'>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-primary-100 ${sortOption === 'priceLowToHigh' ? 'font-bold text-primary-600' : ''}`}
                  onClick={() => { setSortOption('priceLowToHigh'); setShowSortMenu(false); }}
                >
                  Price: Low to High
                </button>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-primary-100 ${sortOption === 'priceHighToLow' ? 'font-bold text-primary-600' : ''}`}
                  onClick={() => { setSortOption('priceHighToLow'); setShowSortMenu(false); }}
                >
                  Price: High to Low
                </button>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-primary-100 ${sortOption === 'newest' ? 'font-bold text-primary-600' : ''}`}
                  onClick={() => { setSortOption('newest'); setShowSortMenu(false); }}
                >
                  Newest First
                </button>
              </div>
            )}
            <div className='h-6 border-l border-gray-300'></div>
            {/* Filter Button */}
            <button
              className='flex items-center gap-1 font-semibold text-gray-700 relative'
              onClick={() => setShowFilters(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25M6.75 21h10.5m-7.5-4.5h4.5m-7.5-4.5h10.5m-7.5-4.5h4.5" />
              </svg>
              Filter
              {isAnyFilterActive() && (
                <span className='absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5'>
                  1
                </span>
              )}
            </button>
          </div>
          {/* Sidebar for desktop, collapsible for mobile */}
          <div className={`sm:block ${showFilters ? '' : 'hidden'} sm:mr-4`}>{<FilterSidebar />}</div>
          <div className='flex-1'>
            <div className='flex justify-between items-center mb-4'>
              <h1 className='text-xl font-bold'>Search Results</h1>
              <button
                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
                onClick={handleCompareToggle}
              >
                {compareMode ? 'Cancel Compare' : 'Compare Products'}
              </button>
            </div>
            {compareMode && (
              <div className='mb-4'>
                <span className='text-sm text-gray-700 mr-2'>Select products to compare</span>
                {selectedForCompare.length >= 2 && (
                  <button
                    className='ml-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700'
                    onClick={handleCompareNow}
                  >
                    Compare Now ({selectedForCompare.length})
                  </button>
                )}
              </div>
            )}
            <p className='font-semibold'>Search Results: {data.length}  </p>
            <InfiniteScroll
              dataLength={data.length}
              hasMore={true}
              next={handleFetchMore}
            >
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4'>
                {data.map((product,index)=>{
                  return(
                    <div key={product?._id+"searchProduct"+index} className='relative'>
                      <CardProduct data={product}/>
                      {compareMode && (
                        <label className='absolute top-2 left-2 z-20 bg-white rounded-full p-1 shadow flex items-center gap-1 text-xs cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={selectedForCompare.some((p) => p._id === product._id)}
                            onChange={() => handleProductSelect(product)}
                          />
                          Select
                        </label>
                      )}
                    </div>
                  )
                })}
                {loading && (
                  loadingArrayCard.map((_,index)=>{
                    return(
                      <CardLoading key={"loadingsearchpage"+index}/>
                    )
                  })
                )}
              </div>
            </InfiniteScroll>
            {/* No data */}
            {!data[0] && !loading && (
              <div className='flex flex-col justify-center items-center w-full mx-auto'>
                <img
                  src={noDataImage} 
                  className='w-full h-full max-w-xs max-h-xs block'
                />
                <p className='font-semibold my-2'>No Data found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchPage
