import React from 'react'

const OrderSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {/* Date Header Skeleton */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Order Cards Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, cardIndex) => (
              <div key={cardIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                {/* Mobile Layout Skeleton */}
                <div className="lg:hidden">
                  <div className="flex space-x-3">
                    {/* Image Skeleton */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                    
                    {/* Content Skeleton */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-1">
                          <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="w-16 h-5 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      
                      <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse"></div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <div className="flex space-x-3">
                          <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
                          <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout Skeleton */}
                <div className="hidden lg:block">
                  <div className="flex items-center space-x-6">
                    {/* Image Skeleton */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                    
                    {/* Product Details Skeleton */}
                    <div className="flex-1 space-y-2">
                      <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-2/3 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Price and Date Skeleton */}
                    <div className="text-right space-y-2">
                      <div className="w-16 h-5 bg-gray-200 rounded animate-pulse ml-auto"></div>
                      <div className="w-20 h-3 bg-gray-200 rounded animate-pulse ml-auto"></div>
                    </div>
                    
                    {/* Status and Actions Skeleton */}
                    <div className="flex flex-col items-end space-y-3 min-w-[200px]">
                      <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex space-x-3">
                        <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderSkeleton