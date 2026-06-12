import mongoose from 'mongoose';
import Item from '../models/Item.js';
import asyncHandler from '../utils/asyncHandler.js';
import { findItemWithOwnerCheck } from '../utils/itemOwnership.js';

// Naya item add karne ka logic
export const addItem = asyncHandler(async (req, res) => {
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
});

// Saare items ko fetch karne ka logic
export const getItems = asyncHandler(async (req, res) => {
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
});

// Ek item ko get karne ka logic
export const getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid item ID format" });
  }

  const item = await Item.findById(id).populate('sellerId', 'name email collegeName');
  
  if (!item) {
    return res.status(404).json({ message: "Item nahi mila!" });
  }

  res.status(200).json(item);
});

// Item delete karne ka logic
export const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await findItemWithOwnerCheck(id, req.user.userId);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }

  await Item.findByIdAndDelete(id);
  res.status(200).json({ message: "Item delete ho gaya!" });
});

// Item mark as sold
export const markAsSold = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let item;
  try {
    item = await findItemWithOwnerCheck(id, req.user.userId);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }

  item.isAvailable = false;
  await item.save();

  res.status(200).json({ message: "Item sold ho gaya!", item });
});
