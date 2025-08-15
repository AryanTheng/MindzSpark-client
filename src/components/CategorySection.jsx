import React from 'react';
import { Link } from 'react-router-dom';
import { valideURLConvert } from '../utils/valideURLConvert';

const CategorySection = ({ loadingCategory, categoryData, subCategoryData }) => {
  // Helper to get first subcategory for a category
  const getFirstSubCategory = (catId) => {
    return subCategoryData?.find(sub => sub.category.some(c => c._id === catId));
  };

  return (
    <div className="container mx-auto px-4 my-4">
      <div className="overflow-x-auto" style={{ 
        scrollbarWidth: 'thin',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}>
        <div className="flex gap-6 pb-4" style={{ scrollBehavior: 'smooth' }}>
          {loadingCategory
            ? new Array(10).fill(null).map((_, index) => (
                <div key={index + 'loadingcategory'} className="flex-none w-24 flex flex-col items-center">
                  <div className="bg-blue-100 rounded-full w-20 h-20 mb-2 animate-pulse" />
                  <div className="bg-blue-100 h-4 w-16 rounded animate-pulse" />
                </div>
              ))
            : categoryData.map((cat) => {
                const sub = getFirstSubCategory(cat._id);
                let url = '#';
                if (sub) {
                  url = `/${valideURLConvert(cat.name)}-${cat._id}/${valideURLConvert(sub.name)}-${sub._id}`;
                }
                return (
                  <Link
                    key={cat._id + 'displayCategory'}
                    to={url}
                    className="flex-none w-24 flex flex-col items-center cursor-pointer group focus:outline-none hover:scale-105 transition-transform duration-200"
                    tabIndex={0}
                  >
                    <div className="w-20 h-20 flex items-center justify-center mb-2 bg-white rounded-full border border-gray-100 overflow-hidden group-hover:shadow-lg transition">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="object-contain w-16 h-16"
                        draggable="false"
                      />
                    </div>
                    <span className="text-center text-sm font-medium text-gray-800 truncate w-full">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default CategorySection; 