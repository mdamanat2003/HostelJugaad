import React from 'react';

const LostFoundCard = ({ item }) => {
  const isLost = item.type === 'Lost';

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col hover:-translate-y-1">
      
      {/* Image Placeholder & Type Badge */}
      <div className="h-40 bg-gray-50 flex items-center justify-center relative border-b border-gray-100 group-hover:bg-orange-50/50 transition-colors">
        <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">{item.icon || '🎒'}</span>
        
        {/* Status Badge (Lost/Found) */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-widest shadow-sm ${
            isLost 
              ? 'bg-red-100 text-red-700 border-red-200' 
              : 'bg-emerald-100 text-emerald-700 border-emerald-200'
          }`}>
            {item.type}
          </span>
        </div>
      </div>

      {/* Item Info */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-gray-400">{item.date}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {item.title}
        </h3>
        
        {/* Location & Details */}
        <div className="space-y-1.5 mb-4">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span>📍</span> {item.location}
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span>👤</span> Reported by: <span className="font-medium text-gray-800">{item.reportedBy}</span>
          </p>
        </div>
        
        {/* Action Button */}
        <div className="mt-auto pt-2">
          <button className={`w-full py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 ${
            isLost 
              ? 'bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white' 
              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white'
          }`}>
            {isLost ? 'I Found This' : 'Claim This Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LostFoundCard;