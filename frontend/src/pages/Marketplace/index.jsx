import React, { useState, useEffect } from "react";
import { itemAPI } from "../../services/api";
import ProductCard from "../../components/ui/ProductCard";
import Modal from "../../components/ui/Modal";
import PageLayout from "../../components/ui/PageLayout";
import SearchBar from "../../components/ui/SearchBar";
import EmptyState from "../../components/ui/EmptyState";
import ErrorAlert from "../../components/ui/ErrorAlert";
import FormActions from "../../components/ui/FormActions";
import useFormHandler from "../../hooks/useFormHandler";
import useAsyncData from "../../hooks/useAsyncData";
import { getCurrentUser } from "../../utils/helpers";

const INITIAL_FORM = {
  title: '',
  description: '',
  category: 'Electronics',
  price: '',
  originalPrice: '',
  condition: 'Used',
  sellerContact: '',
};

const categories = [
  "All",
  "Electronics",
  "Books",
  "Furniture",
  "Cycles",
  "Fashion",
];

const Marketplace = () => {
  // --- LOGIC PART ---
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const { formData, handleChange, resetForm } = useFormHandler(INITIAL_FORM);
  const { data: items, loading, setLoading, error, setError, execute } = useAsyncData([]);

  // Fetch items from API
  useEffect(() => {
    fetchItems();
  }, [activeCategory]);

  const fetchItems = () => {
    execute(() => itemAPI.getItems(activeCategory, searchQuery)).catch(() => {});
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = getCurrentUser();
      
      const itemPayload = {
        ...formData,
        sellerId: user.id,
        sellerName: user.name,
      };

      await itemAPI.addItem(itemPayload, imageFile);
      
      resetForm();
      setImageFile(null);
      setIsModalOpen(false);
      
      // Refresh items list
      await execute(() => itemAPI.getItems(activeCategory, searchQuery));
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
    <PageLayout>
      {/* Header Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Campus Marketplace &#x1F6D2;
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Buy and sell study materials, furniture, and more within your
            campus safely.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-gray-800 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>+</span> Post an Item
        </button>
      </div>

      {/* Filters & Search Section */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
          placeholder="Search for calculators, books, cycles..."
          className="flex-grow md:max-w-md"
        />

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
          <EmptyState
            icon="&#x1F4ED;"
            title="No items found"
            message="We couldn't find anything matching your search. Try adjusting your filters or search query."
            onReset={() => {
              setSearchQuery("");
              setActiveCategory("All");
            }}
          />
        )}
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Post a New Ad &#x1F4E6;"
      >
        <form className="space-y-4" onSubmit={handleAddItem}>
          <ErrorAlert message={error} />
          
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Ad Title</label>
            <input 
              type="text" 
              name="title"
              placeholder="What are you selling?" 
              value={formData.title}
              onChange={handleChange}
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
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Price (&#x20B9;)</label>
              <input 
                type="number" 
                name="price"
                placeholder="e.g. 500" 
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Original Price (&#x20B9;)</label>
              <input 
                type="number" 
                name="originalPrice"
                placeholder="e.g. 1000" 
                value={formData.originalPrice}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
              onChange={handleChange}
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

          <FormActions
            onCancel={() => setIsModalOpen(false)}
            loading={loading}
            submitLabel="Post Item"
            loadingLabel="Posting..."
          />
        </form>
      </Modal>
    </PageLayout>
  );
};

export default Marketplace;
