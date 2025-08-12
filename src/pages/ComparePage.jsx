import React from 'react';
import { useCompare } from '../provider/CompareProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useNavigate } from 'react-router-dom';

const ComparePage = () => {
  const { compareList, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (compareList.length < 2) {
    return (
      <div className="container mx-auto p-4 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Select at least 2 products to compare.</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate('/search')}
        >
          Go to Search
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-[60vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Comparison</h1>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={clearCompare}
        >
          Clear Comparison
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100 text-left">Attribute</th>
              {compareList.map((product) => (
                <th key={product._id} className="border p-2 bg-gray-50 text-center">
                  <img src={product.image[0]} alt={product.name} className="w-24 h-24 object-contain mx-auto mb-2" />
                  <div className="font-semibold">{product.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 font-medium">Price</td>
              {compareList.map((product) => (
                <td key={product._id} className="border p-2 text-center">{DisplayPriceInRupees(product.price)}</td>
              ))}
            </tr>
            <tr>
              <td className="border p-2 font-medium">Unit</td>
              {compareList.map((product) => (
                <td key={product._id} className="border p-2 text-center">{product.unit}</td>
              ))}
            </tr>
            <tr>
              <td className="border p-2 font-medium">Discount</td>
              {compareList.map((product) => (
                <td key={product._id} className="border p-2 text-center">{product.discount ? `${product.discount}%` : '-'}</td>
              ))}
            </tr>
            <tr>
              <td className="border p-2 font-medium">Description</td>
              {compareList.map((product) => (
                <td key={product._id} className="border p-2 text-center">{product.description || '-'}</td>
              ))}
            </tr>
            {/* Add more attributes as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage; 