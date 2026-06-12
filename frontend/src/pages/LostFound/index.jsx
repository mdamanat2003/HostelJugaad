import React, { useState } from 'react';
import LostFoundCard from '../../components/ui/LostFoundCard';
import Modal from '../../components/ui/Modal';

const CATEGORIES = ['Electronics', 'Wallets & IDs', 'Keys', 'Books & Notes', 'Accessories', 'Other'];

const LostFound = () => {
  // States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All'); // All, Lost, Found
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const [form, setForm] = useState({
    type: 'Lost',
    title: '',
    category: '',
    date: '',
    location: '',
    description: ''
  });

  // Dummy Data
  const itemsList = [
    { id: 1, type: 'Lost', title: 'Black Boat Smartwatch', category: 'Accessories', date: 'Oct 12, 2025', location: 'Near CSE Block Canteen', reporterName: 'Rahul Kumar', image: 'https://placehold.co/600x400/f3f4f6/4b5563?text=Smartwatch' },
    { id: 2, type: 'Found', title: 'Hostel Room Keys (B-Block)', category: 'Keys', date: 'Oct 14, 2025', location: 'Main Library 2nd Floor', reporterName: 'Amanat', image: 'https://placehold.co/600x400/f3f4f6/4b5563?text=Keys' },
    { id: 3, type: 'Lost', title: 'College ID Card', category: 'Wallets & IDs', date: 'Oct 10, 2025', location: 'University Ground', reporterName: 'Priya Sharma', image: '' },
    { id: 4, type: 'Found', title: 'Casio Scientific Calculator', category: 'Electronics', date: 'Oct 15, 2025', location: 'Physics Lab 3', reporterName: 'Vikram', image: 'https://placehold.co/600x400/f3f4f6/4b5563?text=Calculator' },
  ];

  // Filtering Logic
  const filteredItems = itemsList.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.type === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Item:", form, selectedImage);
    alert(`Success! Your ${form.type} item has been reported.`);
    
    // Reset Form
    setForm({ type: 'Lost', title: '', category: '', date: '', location: '', description: '' });
    setSelectedImage(null);
    setIsReportModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header Section */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              Lost & Found <span className="text-4xl">🕵️‍♂️</span>
            </h1>
            <p className="text-gray-500 mt-2 text-lg max-w-xl">
              Lost something precious or found something that isn't yours? Help the campus community by reporting it here.
            </p>
          </div>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>+</span> Report an Item
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Tabs */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm w-full md:w-auto">
            {['All', 'Lost', 'Found'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeFilter === tab 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab} Items
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input 
              type="text" 
              placeholder="Search by item name or location..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <LostFoundCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full bg-white border border-gray-100 shadow-sm rounded-2xl py-16 flex flex-col items-center justify-center text-center">
              <span className="text-6xl mb-4 opacity-50">📭</span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No items found</h3>
              <p className="text-gray-500 max-w-sm">We couldn't find any {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} items matching your search.</p>
            </div>
          )}
        </div>

        {/* REPORT MODAL */}
        <Modal 
          isOpen={isReportModalOpen} 
          onClose={() => { setIsReportModalOpen(false); setSelectedImage(null); }} 
          title="Report an Item 📢"
        >
          <form className="space-y-4" onSubmit={handleReportSubmit}>
            
            {/* Type Selection (Lost or Found) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">What are you reporting?</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`cursor-pointer border rounded-xl py-3 text-center font-bold transition-all ${
                  form.type === 'Lost' ? 'bg-red-50 border-red-500 text-red-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}>
                  <input type="radio" name="type" value="Lost" checked={form.type === 'Lost'} onChange={handleFormChange} className="hidden" />
                  I Lost Something
                </label>
                <label className={`cursor-pointer border rounded-xl py-3 text-center font-bold transition-all ${
                  form.type === 'Found' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}>
                  <input type="radio" name="type" value="Found" checked={form.type === 'Found'} onChange={handleFormChange} className="hidden" />
                  I Found Something
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Item Name *</label>
              <input type="text" name="title" value={form.title} onChange={handleFormChange} placeholder="e.g. Blue Milton Water Bottle" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white text-sm" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Category *</label>
                <select name="category" value={form.category} onChange={handleFormChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white text-sm appearance-none cursor-pointer" required>
                  <option value="">Select...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Date *</label>
                <input type="date" name="date" value={form.date} onChange={handleFormChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white text-sm" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Location *</label>
              <input type="text" name="location" value={form.location} onChange={handleFormChange} placeholder="Where was it lost/found?" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white text-sm" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={handleFormChange} rows="3" placeholder="Any specific details, brand, color, etc." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white text-sm resize-none"></textarea>
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Add an Image (Optional)</label>
              <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer group bg-white">
                <div className="space-y-1 text-center">
                  {selectedImage ? (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-2">📷</span>
                      <p className="text-sm font-bold text-blue-600">{selectedImage.name}</p>
                    </div>
                  ) : (
                    <>
                      <svg className="mx-auto h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center mt-2">
                        <span className="relative font-medium text-blue-600">Select an image</span>
                      </div>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} />
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button type="button" onClick={() => { setIsReportModalOpen(false); setSelectedImage(null); }} className="px-5 py-2.5 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-colors text-sm">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all text-sm">Submit Report</button>
            </div>
          </form>
        </Modal>

      </div>
    </div>
  );
};

export default LostFound;