import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5";
import EditProductAdmin from '../components/EditProductAdmin'
import Papa from 'papaparse';
import { useRef } from 'react';

const ProductAdmin = () => {
  const [productData,setProductData] = useState([])
  const [page,setPage] = useState(1)
  const [loading,setLoading] = useState(false)
  const [totalPageCount,setTotalPageCount] = useState(1)
  const [search,setSearch] = useState("")
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [csvProducts, setCsvProducts] = useState([]);
  const [csvError, setCsvError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef();
  
  const fetchProductData = async()=>{
    try {
        setLoading(true)
        const response = await Axios({
           ...SummaryApi.getProduct,
           data : {
              page : page,
              limit : 12,
              search : search 
           }
        })

        const { data : responseData } = response 

        if(responseData.success){
          setTotalPageCount(responseData.totalNoPage)
          setProductData(responseData.data)
        }

    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    fetchProductData()
  },[page])

  const handleNext = ()=>{
    if(page !== totalPageCount){
      setPage(preve => preve + 1)
    }
  }
  const handlePrevious = ()=>{
    if(page > 1){
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e)=>{
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(()=>{
    let flag = true 

    const interval = setTimeout(() => {
      if(flag){
        fetchProductData()
        flag = false
      }
    }, 300);

    return ()=>{
      clearTimeout(interval)
    }
  },[search])

  const handleCsvFile = (e) => {
    setCsvError('');
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          setCsvError('CSV Parse Error: ' + results.errors[0].message);
          setCsvProducts([]);
          return;
        }
        // Convert spec_ columns to more_details
        const products = results.data.map(row => {
          const more_details = {};
          const product = { ...row };
          Object.keys(row).forEach(key => {
            if (key.startsWith('spec_')) {
              more_details[key.replace('spec_', '')] = row[key];
              delete product[key];
            }
          });
          product.more_details = more_details;
          // Convert numeric fields
          if (product.price) product.price = Number(product.price);
          if (product.discount) product.discount = Number(product.discount);
          if (product.stock) product.stock = Number(product.stock);
          if (product.sellerRating) product.sellerRating = Number(product.sellerRating);
          if (product.sellerRatingCount) product.sellerRatingCount = Number(product.sellerRatingCount);
          // Convert image to array if comma separated
          if (product.image && typeof product.image === 'string') {
            product.image = product.image.split(',').map(s => s.trim());
          }
          // Convert category/subCategory to array if comma separated
          if (product.category && typeof product.category === 'string') {
            product.category = product.category.split(',').map(s => s.trim());
          }
          if (product.subCategory && typeof product.subCategory === 'string') {
            product.subCategory = product.subCategory.split(',').map(s => s.trim());
          }
          return product;
        });
        setCsvProducts(products);
      },
      error: (err) => {
        setCsvError('CSV Parse Error: ' + err.message);
        setCsvProducts([]);
      }
    });
  };
  
  const csvTemplateHeaders = [
    'name', 'description', 'image', 'price', 'discount', 'unit', 'stock', 'category', 'subCategory', 'seller', 'sellerRating', 'sellerRatingCount',
    'spec_Color', 'spec_Size', 'spec_Material'
  ];
  const csvTemplateExample = [
    ['T-shirt', 'Best cotton tee', 'http://img1.jpg', '499', '10', '1pc', '100', 'Clothing', 'Men', 'BrandX', '4.5', '100', 'Red', 'M', 'Cotton']
  ];
  const handleDownloadTemplate = () => {
    const rows = [csvTemplateHeaders, ...csvTemplateExample];
    const csvContent = rows.map(r => r.map(x => '"' + x + '"').join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleBulkUpload = async () => {
    setUploading(true);
    setUploadResult(null);
    try {
      const res = await Axios.post('/api/product/bulk-upload', { products: csvProducts });
      setUploadResult(res.data);
      if (res.data.success) {
        setCsvProducts([]);
        fetchProductData();
      }
    } catch (err) {
      setUploadResult({ success: false, message: err?.response?.data?.message || err.message });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <section className=''>
        <div className='p-2  bg-white shadow-md flex items-center justify-between gap-4'>
                <h2 className='font-semibold'>Product</h2>
                <div className='flex gap-2'>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold text-sm"
                    onClick={() => setShowBulkModal(true)}
                  >
                    Bulk Upload (CSV)
                  </button>
                  <div className='h-full min-w-24 max-w-56 w-full ml-auto bg-blue-50 px-4 flex items-center gap-3 py-2 rounded  border focus-within:border-primary-200'>
                    <IoSearchOutline size={25}/>
                    <input
                      type='text'
                      placeholder='Search product here ...' 
                      className='h-full w-full  outline-none bg-transparent'
                      value={search}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
        </div>
        {/* Bulk Upload Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
              <button className="absolute top-2 right-2 text-xl" onClick={() => setShowBulkModal(false)}>&times;</button>
              <h3 className="text-lg font-bold mb-4">Bulk Product Upload (CSV)</h3>
              <div className="flex gap-4 mb-4">
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleCsvFile}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold"
                  onClick={handleDownloadTemplate}
                  type="button"
                >
                  Download Template
                </button>
              </div>
              {csvError && <div className="text-red-600 mb-2">{csvError}</div>}
              {csvProducts.length > 0 && (
                <div className="max-h-64 overflow-auto border rounded mb-4">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        {Object.keys(csvProducts[0]).map(col => (
                          <th key={col} className="border-b px-2 py-1 bg-blue-50">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvProducts.map((row, i) => (
                        <tr key={i}>
                          {Object.keys(csvProducts[0]).map(col => (
                            <td key={col} className="border-b px-2 py-1">{typeof row[col] === 'object' ? JSON.stringify(row[col]) : row[col]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {uploadResult && (
                <div className={uploadResult.success ? 'text-green-700 mb-2' : 'text-red-600 mb-2'}>
                  {uploadResult.success
                    ? `Uploaded ${uploadResult.createdCount} products. ${uploadResult.errorCount} errors.`
                    : `Upload failed: ${uploadResult.message}`}
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <ul className="text-xs mt-1 list-disc ml-4">
                      {uploadResult.errors.map((e, i) => (
                        <li key={i}>{e.product}: {e.error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div className="flex justify-end mt-4 gap-2">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowBulkModal(false)} disabled={uploading}>Cancel</button>
                <button
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold disabled:opacity-60"
                  onClick={handleBulkUpload}
                  disabled={csvProducts.length === 0 || uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        )}
        {
          loading && (
            <Loading/>
          )
        }


        <div className='p-4 bg-blue-50'>


            <div className='min-h-[55vh]'>
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                {
                  productData.map((p, index) => (
                    <ProductCardAdmin key={p._id || p.id || index} data={p} fetchProductData={fetchProductData} />
                  ))
                }
              </div>
            </div>
            
            <div className='flex justify-between my-4'>
              <button onClick={handlePrevious} className="border border-primary-200 px-4 py-1 hover:bg-primary-200">Previous</button>
              <button className='w-full bg-slate-100'>{page}/{totalPageCount}</button>
              <button onClick={handleNext} className="border border-primary-200 px-4 py-1 hover:bg-primary-200">Next</button>
            </div>

        </div>
          

      
    </section>
  )
}

export default ProductAdmin
