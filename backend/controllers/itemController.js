import mongoose from 'mongoose';
import Item from '../models/Item.js';

// Naya item add karne ka logic
export const addItem = async (req, res) => {
  try {
    const { title, description, category, price, originalPrice, condition, sellerId, sellerName, sellerContact, imageUrl } = req.body;

    // Validation
    if (!title || !description || !category || !price || !sellerId || !sellerName) {
      return res.status(400).json({ message: "Zaruri field missing hai!" });
    }

    // Naya item create karna
    const newItem = new Item({
      title,
      description,
      category,
      price,
      originalPrice,
      condition: condition || 'Used',
      imageUrl: imageUrl || req.file?.path,
      sellerId,
      sellerName,
      sellerContact,
      isAvailable: true,
    });

    await newItem.save();

    res.status(201).json({
      message: "Item Added Successfully!",
      item: newItem,
    });
  } catch (error) {
    console.error("Add Item Error:", error);
    res.status(500).json({ message: "Item add karne mein error" });
  }
};

// Saare items ko fetch karne ka logic
export const getItems = async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = { isAvailable: true };

    // Filter by category
    const validCategories = ['Electronics', 'Books', 'Furniture', 'Cycles', 'Fashion', 'Other'];
    if (category && category !== 'All') {
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: "Invalid category." });
      }
      query.category = category;
    }

    // Search by title ya description — escape regex special chars to prevent ReDoS
    if (search) {
      const sanitized = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 100);
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } }
      ];
    }

    const items = await Item.find(query).sort({ createdAt: -1 }).limit(50);
    res.status(200).json(items);
  } catch (error) {
    console.error("Fetch Items Error:", error);
    res.status(500).json({ message: "Items fetch karne mein error" });
  }
};

// Ek item ko get karne ka logic
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    const item = await Item.findById(id).populate('sellerId', 'name email collegeName');
    
    if (!item) {
      return res.status(404).json({ message: "Item nahi mila!" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Fetch Item Error:", error);
    res.status(500).json({ message: "Item fetch karne mein error" });
  }
};

// Item delete karne ka logic
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item nahi mila!" });
    }

    // Check using authenticated user from JWT
    if (item.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Aap sirf apna item delete kar sakte ho!" });
    }

    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: "Item delete ho gaya!" });
  } catch (error) {
    console.error("Delete Item Error:", error);
    res.status(500).json({ message: "Delete karne mein error" });
  }
};

// Item mark as sold
export const markAsSold = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item nahi mila!" });
    }

    // Check using authenticated user from JWT
    if (item.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Aap sirf apna item update kar sakte ho!" });
    }

    item.isAvailable = false;
    await item.save();

    res.status(200).json({ message: "Item sold ho gaya!", item });
  } catch (error) {
    console.error("Mark Sold Error:", error);
    res.status(500).json({ message: "Update karne mein error" });
  }
};
