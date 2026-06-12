import React from 'react';

const FilterTabs = ({ tabs, activeTab, onTabChange, variant = 'pill' }) => {
  if (variant === 'rounded') {
    return (
      <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 md:px-8 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
            activeTab === tab
              ? 'bg-gray-900 text-white border-gray-900 shadow-md'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
