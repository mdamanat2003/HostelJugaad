import { jest } from '@jest/globals';

const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockFindByIdAndDelete = jest.fn();
const mockSave = jest.fn();
const mockItemConstructor = jest.fn();
const mockSort = jest.fn();
const mockPopulate = jest.fn();

jest.unstable_mockModule('../models/Item.js', () => {
  const MockItem = function (data) {
    mockItemConstructor(data);
    Object.assign(this, data);
    this.save = mockSave;
  };
  MockItem.find = mockFind;
  MockItem.findById = mockFindById;
  MockItem.findByIdAndDelete = mockFindByIdAndDelete;
  return { default: MockItem };
});

const { addItem, getItems, getItemById, deleteItem, markAsSold } = await import(
  '../controllers/itemController.js'
);

describe('itemController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('addItem', () => {
    const validItem = {
      title: 'Used Laptop',
      description: 'Good condition laptop',
      category: 'Electronics',
      price: 15000,
      originalPrice: 50000,
      condition: 'Used',
      sellerId: 'seller-123',
      sellerName: 'Test Seller',
      sellerContact: '9999999999',
    };

    it('should add a new item successfully', async () => {
      req.body = validItem;
      mockSave.mockResolvedValue();

      await addItem(req, res);

      expect(mockItemConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          title: validItem.title,
          category: validItem.category,
          price: validItem.price,
          isAvailable: true,
        })
      );
      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Item Added Successfully!',
        })
      );
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = { title: 'Laptop' }; // missing required fields

      await addItem(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Zaruri field missing hai!',
      });
    });

    it('should use image from req.file if imageUrl not provided', async () => {
      req.body = { ...validItem, imageUrl: undefined };
      req.file = { path: 'cloudinary://image.jpg' };
      mockSave.mockResolvedValue();

      await addItem(req, res);

      expect(mockItemConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          imageUrl: 'cloudinary://image.jpg',
        })
      );
    });

    it('should default condition to Used if not provided', async () => {
      req.body = { ...validItem, condition: undefined };
      mockSave.mockResolvedValue();

      await addItem(req, res);

      expect(mockItemConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          condition: 'Used',
        })
      );
    });

    it('should return 500 on server error', async () => {
      req.body = validItem;
      mockSave.mockRejectedValue(new Error('DB error'));

      await addItem(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Item add karne mein error',
        })
      );
    });
  });

  describe('getItems', () => {
    it('should fetch all available items', async () => {
      const items = [{ title: 'Laptop' }, { title: 'Book' }];
      mockSort.mockResolvedValue(items);
      mockFind.mockReturnValue({ sort: mockSort });

      await getItems(req, res);

      expect(mockFind).toHaveBeenCalledWith({ isAvailable: true });
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(items);
    });

    it('should filter by category', async () => {
      req.query = { category: 'Electronics' };
      mockSort.mockResolvedValue([]);
      mockFind.mockReturnValue({ sort: mockSort });

      await getItems(req, res);

      expect(mockFind).toHaveBeenCalledWith({
        isAvailable: true,
        category: 'Electronics',
      });
    });

    it('should not filter when category is All', async () => {
      req.query = { category: 'All' };
      mockSort.mockResolvedValue([]);
      mockFind.mockReturnValue({ sort: mockSort });

      await getItems(req, res);

      expect(mockFind).toHaveBeenCalledWith({ isAvailable: true });
    });

    it('should apply search filter on title and description', async () => {
      req.query = { search: 'laptop' };
      mockSort.mockResolvedValue([]);
      mockFind.mockReturnValue({ sort: mockSort });

      await getItems(req, res);

      expect(mockFind).toHaveBeenCalledWith({
        isAvailable: true,
        $or: [
          { title: { $regex: 'laptop', $options: 'i' } },
          { description: { $regex: 'laptop', $options: 'i' } },
        ],
      });
    });

    it('should return 500 on server error', async () => {
      mockFind.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('DB error')),
      });

      await getItems(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Items fetch karne mein error',
        })
      );
    });
  });

  describe('getItemById', () => {
    it('should return an item by id', async () => {
      const item = { title: 'Laptop', sellerId: 'seller-123' };
      req.params = { id: 'item-id-1' };
      mockPopulate.mockResolvedValue(item);
      mockFindById.mockReturnValue({ populate: mockPopulate });

      await getItemById(req, res);

      expect(mockFindById).toHaveBeenCalledWith('item-id-1');
      expect(mockPopulate).toHaveBeenCalledWith('sellerId', 'name email collegeName');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(item);
    });

    it('should return 404 if item not found', async () => {
      req.params = { id: 'nonexistent-id' };
      mockPopulate.mockResolvedValue(null);
      mockFindById.mockReturnValue({ populate: mockPopulate });

      await getItemById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item nahi mila!' });
    });

    it('should return 500 on server error', async () => {
      req.params = { id: 'item-id-1' };
      mockPopulate.mockRejectedValue(new Error('DB error'));
      mockFindById.mockReturnValue({ populate: mockPopulate });

      await getItemById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Item fetch karne mein error',
        })
      );
    });
  });

  describe('deleteItem', () => {
    it('should delete an item owned by the user', async () => {
      req.params = { id: 'item-id-1' };
      req.body = { userId: 'user-123' };
      mockFindById.mockResolvedValue({ sellerId: { toString: () => 'user-123' } });
      mockFindByIdAndDelete.mockResolvedValue();

      await deleteItem(req, res);

      expect(mockFindById).toHaveBeenCalledWith('item-id-1');
      expect(mockFindByIdAndDelete).toHaveBeenCalledWith('item-id-1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item delete ho gaya!' });
    });

    it('should return 404 if item not found', async () => {
      req.params = { id: 'nonexistent-id' };
      req.body = { userId: 'user-123' };
      mockFindById.mockResolvedValue(null);

      await deleteItem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item nahi mila!' });
    });

    it('should return 403 if user does not own the item', async () => {
      req.params = { id: 'item-id-1' };
      req.body = { userId: 'different-user' };
      mockFindById.mockResolvedValue({ sellerId: { toString: () => 'user-123' } });

      await deleteItem(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Aap sirf apna item delete kar sakte ho!',
      });
    });

    it('should return 500 on server error', async () => {
      req.params = { id: 'item-id-1' };
      req.body = { userId: 'user-123' };
      mockFindById.mockRejectedValue(new Error('DB error'));

      await deleteItem(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Delete karne mein error',
        })
      );
    });
  });

  describe('markAsSold', () => {
    it('should mark an item as sold', async () => {
      const item = {
        sellerId: { toString: () => 'user-123' },
        isAvailable: true,
        save: mockSave,
      };
      req.params = { id: 'item-id-1' };
      req.body = { userId: 'user-123' };
      mockFindById.mockResolvedValue(item);
      mockSave.mockResolvedValue();

      await markAsSold(req, res);

      expect(item.isAvailable).toBe(false);
      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Item sold ho gaya!',
        })
      );
    });

    it('should return 404 if item not found', async () => {
      req.params = { id: 'nonexistent-id' };
      req.body = { userId: 'user-123' };
      mockFindById.mockResolvedValue(null);

      await markAsSold(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item nahi mila!' });
    });

    it('should return 403 if user does not own the item', async () => {
      req.params = { id: 'item-id-1' };
      req.body = { userId: 'different-user' };
      mockFindById.mockResolvedValue({
        sellerId: { toString: () => 'user-123' },
        save: mockSave,
      });

      await markAsSold(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Aap sirf apna item update kar sakte ho!',
      });
    });

    it('should return 500 on server error', async () => {
      req.params = { id: 'item-id-1' };
      req.body = { userId: 'user-123' };
      mockFindById.mockRejectedValue(new Error('DB error'));

      await markAsSold(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Update karne mein error',
        })
      );
    });
  });
});
