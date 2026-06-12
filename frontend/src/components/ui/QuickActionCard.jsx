import React from 'react';
import { Link } from 'react-router-dom';

const QuickActionCard = ({ title, description, icon, linkTo, badgeText }) => {
  const isPremium = badgeText === 'Hot';

  return (
    <Link 
      to={linkTo}
      className="group relative flex flex-col items-start p-6 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 group-hover:scale-150 transition-transform duration-500 ease-in-out"></div>

      {badgeText && (
        <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-10 ${isPremium ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
          {badgeText}
        </span>
      )}
      
      <div className="text-4xl mb-4 p-3 bg-gray-50 rounded-xl z-10 group-hover:bg-white transition-colors duration-300">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 z-10 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-sm text-gray-500 mt-2 z-10">{description}</p>
      
      <div className="mt-4 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        Explore <span className="ml-1">→</span>
      </div>
    </Link>
  );
};

export default QuickActionCard;