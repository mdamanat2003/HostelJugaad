import { jest } from '@jest/globals';

const mockFind = jest.fn();
const mockSave = jest.fn();
const mockPYQConstructor = jest.fn();
const mockSort = jest.fn();
const mockFindByIdAndUpdate = jest.fn();

jest.unstable_mockModule('../models/PYQ.js', () => {
  const MockPYQ = function (data) {
    mockPYQConstructor(data);
    Object.assign(this, data);
    this.save = mockSave;
  };
  MockPYQ.find = mockFind;
  MockPYQ.findByIdAndUpdate = mockFindByIdAndUpdate;
  return { default: MockPYQ };
});

const { uploadPYQ, getPYQs, incrementViews } = await import('../controllers/pyqController.js');

describe('pyqController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, file: null, query: {}, user: { userId: 'user-123' }, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('uploadPYQ', () => {
    const validPYQ = {
      subject: 'Mathematics',
      code: 'MATH101',
      examType: 'midsem1',
      year: '2024-25',
      course: 'Department of Computer Science & Engineering (CSE)',
      branch: 'BTech - Computer Science & Engineering',
      semester: '3 Sem',
      isSolved: 'false',
    };

    it('should upload a PYQ successfully', async () => {
      req.body = validPYQ;
      req.file = { path: 'cloudinary://pyq-file.pdf' };
      mockSave.mockResolvedValue();

      await uploadPYQ(req, res);

      expect(mockPYQConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: validPYQ.subject,
          code: validPYQ.code,
          examType: validPYQ.examType,
          year: validPYQ.year,
          fileUrl: 'cloudinary://pyq-file.pdf',
          uploadedBy: 'user-123',
        })
      );
      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'PYQ Uploaded Successfully!',
        })
      );
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = { subject: 'Math' };
      req.file = { path: 'cloudinary://pyq-file.pdf' };

      await uploadPYQ(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if no file is uploaded', async () => {
      req.body = validPYQ;
      req.file = null;

      await uploadPYQ(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'File is required.',
      });
    });

    it('should return 500 on server error', async () => {
      req.body = validPYQ;
      req.file = { path: 'cloudinary://pyq-file.pdf' };
      mockSave.mockRejectedValue(new Error('DB error'));

      await uploadPYQ(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Server error during upload',
        })
      );
    });
  });

  describe('getPYQs', () => {
    it('should fetch all PYQs sorted by newest first', async () => {
      const pyqs = [
        { subject: 'Math', year: '2024-25' },
        { subject: 'Physics', year: '2023-24' },
      ];
      mockSort.mockResolvedValue(pyqs);
      mockFind.mockReturnValue({ sort: mockSort });

      await getPYQs(req, res);

      expect(mockFind).toHaveBeenCalledWith({});
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(pyqs);
    });

    it('should apply query filters', async () => {
      req.query = { course: 'CSE', examType: 'endsem' };
      mockSort.mockResolvedValue([]);
      mockFind.mockReturnValue({ sort: mockSort });

      await getPYQs(req, res);

      expect(mockFind).toHaveBeenCalledWith({ course: 'CSE', examType: 'endsem' });
    });

    it('should apply search filter', async () => {
      req.query = { search: 'math' };
      mockSort.mockResolvedValue([]);
      mockFind.mockReturnValue({ sort: mockSort });

      await getPYQs(req, res);

      expect(mockFind).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: expect.arrayContaining([
            { subject: { $regex: 'math', $options: 'i' } },
          ]),
        })
      );
    });

    it('should return 500 on server error', async () => {
      mockFind.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('DB error')),
      });

      await getPYQs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error fetching PYQs',
      });
    });
  });

  describe('incrementViews', () => {
    it('should increment view count', async () => {
      const updatedPyq = { _id: 'pyq-1', views: 5 };
      mockFindByIdAndUpdate.mockResolvedValue(updatedPyq);
      req.params = { id: 'pyq-1' };

      await incrementViews(req, res);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('pyq-1', { $inc: { views: 1 } }, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedPyq);
    });

    it('should return 404 if PYQ not found', async () => {
      mockFindByIdAndUpdate.mockResolvedValue(null);
      req.params = { id: 'nonexistent' };

      await incrementViews(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 500 on server error', async () => {
      mockFindByIdAndUpdate.mockRejectedValue(new Error('DB error'));
      req.params = { id: 'pyq-1' };

      await incrementViews(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
