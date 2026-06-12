import React, { useState, useEffect } from "react";
import { itemAPI } from "../../services/api";
import ProductCard from "../../components/ui/ProductCard";
import Modal from "../../components/ui/Modal";

const Marketplace = () => {
  // --- LOGIC PART ---
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    condition: 'Used',
    sellerContact: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const categories = [
    "All",
    "Electronics",
    "Books",
    "Furniture",
    "Cycles",
    "Fashion",
  ];

  // Fetch items from API
  useEffect(() => {
    fetchItems();
  }, [activeCategory]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await itemAPI.getItems(activeCategory, searchQuery);
      setItems(response.data);
      setError('');
    } catch (err) {
      setError('Items load nahi ho sake');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let user = {};
      try {
        user = JSON.parse(localStorage.getItem('user') || '{}');
      } catch {
        localStorage.removeItem('user');
      }
      
      const itemPayload = {
        ...formData,
        sellerId: user.id,
        sellerName: user.name,
      };

      await itemAPI.addItem(itemPayload, imageFile);
      
      setFormData({
        title: '',
        description: '',
        category: 'Electronics',
        price: '',
        originalPrice: '',
        condition: 'Used',
        sellerContact: '',
      });
      setImageFile(null);
      setIsModalOpen(false);
      
      // Refresh items list
      await fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Item add nahi ho sake');
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search and category
  const filteredItems = items.filter((item) => {
    const matchCategory = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // --- DESIGN (UI) PART ---
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Campus Marketplace 🛒
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Buy and sell study materials, furniture, and more within your
              campus safely.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)} // Yeh add kiya
            className="w-full md:w-auto bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-gray-800 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>+</span> Post an Item
          </button>
        </div>

        {/* Filters & Search Section */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-grow md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search for calculators, books, cycles..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-700 shadow-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyUp={() => fetchItems()}
            />
          </div>

          {/* Categories Scrollable Row */}
          <div className="flex-grow overflow-x-auto hide-scrollbar flex items-center bg-white p-2 border border-gray-200 rounded-2xl shadow-sm">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full bg-white rounded-3xl border border-gray-100 py-16 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-6xl mb-4 opacity-50">📭</span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No items found
              </h3>
              <p className="text-gray-500 max-w-sm">
                We couldn't find anything matching your search. Try adjusting
                your filters or search query.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Post a New Ad 📦"
        >
          <form className="space-y-4" onSubmit={handleAddItem}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Ad Title</label>
              <input 
                type="text" 
                name="title"
                placeholder="What are you selling?" 
                value={formData.title}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Description</label>
              <textarea 
                name="description"
                placeholder="Describe the item..." 
                value={formData.description}
                onChange={handleFormChange}
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Price (₹)</label>
                <input 
                  type="number" 
                  name="price"
                  placeholder="e.g. 500" 
                  value={formData.price}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Original Price (₹)</label>
                <input 
                  type="number" 
                  name="originalPrice"
                  placeholder="e.g. 1000" 
                  value={formData.originalPrice}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                >
                  {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Condition</label>
                <select 
                  name="condition"
                  value={formData.condition}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                >
                  <option>Like New</option>
                  <option>Used</option>
                  <option>Good</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Contact Number</label>
              <input 
                type="tel" 
                name="sellerContact"
                placeholder="Your mobile number" 
                value={formData.sellerContact}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Upload Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post Item'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Marketplace;
