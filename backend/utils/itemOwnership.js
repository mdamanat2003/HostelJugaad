import mongoose from 'mongoose';
import Item from '../models/Item.js';

export const findItemWithOwnerCheck = async (itemId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    const err = new Error('Invalid item ID format');
    err.status = 400;
    throw err;
  }

  const item = await Item.findById(itemId);
  if (!item) {
    const err = new Error('Item nahi mila!');
    err.status = 404;
    throw err;
  }
  if (item.sellerId.toString() !== userId) {
    const err = new Error('Aap sirf apna item modify kar sakte ho!');
    err.status = 403;
    throw err;
  }
  return item;
};
