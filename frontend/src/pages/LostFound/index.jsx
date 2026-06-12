import React, { useState } from 'react';
import LostFoundCard from '../../components/ui/LostFoundCard';

const LostFound = () => {
  // --- LOGIC PART ---
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Lost', 'Found'
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy Data
  const items = [
    { id: 1, type: 'Lost', title: 'Black Wallet with ID', location: 'Library 2nd Floor', date: 'Today, 10:30 AM', reportedBy: 'Rahul (CSE)', icon: '👛' },
    { id: 2, type: 'Found', title: 'Casio Scientific Calculator', location: 'Block B, Room 302', date: 'Yesterday, 4:00 PM', reportedBy: 'Amanat', icon: '🖩' },
    { id: 3, type: 'Lost', title: 'Hostel Room Keys', location: 'Near Canteen', date: 'Oct 12, 2:15 PM', reportedBy: 'Priya (ECE)', icon: '🔑' },
    { id: 4, type: 'Found', title: 'Blue Umbrella', location: 'Main Gate Security', date: 'Oct 11, 9:00 AM', reportedBy: 'Guard Ram', icon: '☂️' },
    { id: 5, type: 'Lost', title: 'Boat Wireless Earbuds', location: 'Sports Ground', date: 'Today, 8:00 AM', reportedBy: 'Vikas', icon: '🎧' },
  ];

  const filteredItems = items.filter(item => {
    const matchTab = activeTab === 'All' || item.type === activeTab;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  // --- DESIGN (UI) PART ---
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Banner (Urgent/Alert Theme) */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-orange-900/20 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
              Lost & Found <span className="text-4xl">🔍</span>
            </h1>
            <p className="text-orange-100 text-lg max-w-lg">
              Lost something precious? Or found an item that belongs to someone else? Report it here and help your campus mates!
            </p>
          </div>
          
          <div className="relative z-10 mt-6 md:mt-0 w-full md:w-auto">
            <button className="w-full md:w-auto bg-white text-orange-600 px-8 py-3.5 rounded-xl font-black shadow-lg hover:bg-gray-50 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2">
              <span>+</span> Report an Item
            </button>
          </div>
        </div>

        {/* Search and Tabs */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          
          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
            {['All', 'Lost', 'Found'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:px-8 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab} Items
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input 
              type="text" 
              placeholder="Search by item name or location..." 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition-all font-medium text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <LostFoundCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full bg-white rounded-3xl border border-gray-100 py-16 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-6xl mb-4 opacity-50">🤷‍♂️</span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No items found</h3>
              <p className="text-gray-500 max-w-sm">No items match your search or filter. You can report a new item if you lost or found something.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LostFound;