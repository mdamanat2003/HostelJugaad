import React from 'react';

const ProductCard = ({ product }) => {
  // --- LOGIC PART ---
  const hasDiscount = product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Condition ke hisaab se badge color set karna
  const getConditionColor = (condition) => {
    switch(condition) {
      case 'New': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Like New': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // --- DESIGN (UI) PART ---
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col hover:-translate-y-1">
      
      {/* Image Placeholder with Icon */}
      <div className="h-48 bg-gray-50 flex items-center justify-center relative border-b border-gray-100 group-hover:bg-blue-50/50 transition-colors">
        <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">{product.icon || '📦'}</span>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getConditionColor(product.condition)} uppercase tracking-wide`}>
            {product.condition}
          </span>
          {hasDiscount && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md max-w-max shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{product.category}</p>
          <span className="text-xs text-gray-400">2d ago</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.title}</h3>
        
        <div className="mt-auto pt-4 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-gray-900">₹{product.price}</span>
              {hasDiscount && (
                <span className="text-sm font-medium text-gray-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 transition-all active:scale-95">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;