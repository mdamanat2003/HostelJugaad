import React, { useState } from 'react';
import LostFoundCard from '../../components/ui/LostFoundCard';
import PageLayout from '../../components/ui/PageLayout';
import SearchBar from '../../components/ui/SearchBar';
import EmptyState from '../../components/ui/EmptyState';
import FilterTabs from '../../components/ui/FilterTabs';

const LostFound = () => {
  // --- LOGIC PART ---
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Lost', 'Found'
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy Data
  const items = [
    { id: 1, type: 'Lost', title: 'Black Wallet with ID', location: 'Library 2nd Floor', date: 'Today, 10:30 AM', reportedBy: 'Rahul (CSE)', icon: '\uD83D\uDC5B' },
    { id: 2, type: 'Found', title: 'Casio Scientific Calculator', location: 'Block B, Room 302', date: 'Yesterday, 4:00 PM', reportedBy: 'Amanat', icon: '\uD83D\uDDA9' },
    { id: 3, type: 'Lost', title: 'Hostel Room Keys', location: 'Near Canteen', date: 'Oct 12, 2:15 PM', reportedBy: 'Priya (ECE)', icon: '\uD83D\uDD11' },
    { id: 4, type: 'Found', title: 'Blue Umbrella', location: 'Main Gate Security', date: 'Oct 11, 9:00 AM', reportedBy: 'Guard Ram', icon: '\u2602\uFE0F' },
    { id: 5, type: 'Lost', title: 'Boat Wireless Earbuds', location: 'Sports Ground', date: 'Today, 8:00 AM', reportedBy: 'Vikas', icon: '\uD83C\uDFA7' },
  ];

  const filteredItems = items.filter(item => {
    const matchTab = activeTab === 'All' || item.type === activeTab;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  // --- DESIGN (UI) PART ---
  return (
    <PageLayout>
      {/* Header Banner (Urgent/Alert Theme) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-orange-900/20 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
            Lost & Found <span className="text-4xl">&#x1F50D;</span>
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
        <FilterTabs
          tabs={['All', 'Lost', 'Found']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="rounded"
        />
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by item name or location..."
          className="w-full md:w-96"
        />
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <LostFoundCard key={item.id} item={item} />
          ))
        ) : (
          <EmptyState
            icon="&#x1F937;&#x200D;&#x2642;&#xFE0F;"
            title="No items found"
            message="No items match your search or filter. You can report a new item if you lost or found something."
          />
        )}
      </div>
    </PageLayout>
  );
};

export default LostFound;
