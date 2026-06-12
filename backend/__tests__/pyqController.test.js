import { jest } from '@jest/globals';

const mockFind = jest.fn();
const mockSave = jest.fn();
const mockPYQConstructor = jest.fn();
const mockSort = jest.fn();

jest.unstable_mockModule('../models/PYQ.js', () => {
  const MockPYQ = function (data) {
    mockPYQConstructor(data);
    Object.assign(this, data);
    this.save = mockSave;
  };
  MockPYQ.find = mockFind;
  return { default: MockPYQ };
});

const { uploadPYQ, getPYQs } = await import('../controllers/pyqController.js');

describe('pyqController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, file: null };
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
      examType: 'Mid-Term',
      year: 2024,
      uploaderId: 'user-123',
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

    it('should return 400 if no file is uploaded', async () => {
      req.body = validPYQ;
      req.file = null;

      await uploadPYQ(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Bhai, file toh select karo!',
      });
    });

    it('should use dummy uploaderId if not provided', async () => {
      req.body = { ...validPYQ, uploaderId: undefined };
      req.file = { path: 'cloudinary://pyq-file.pdf' };
      mockSave.mockResolvedValue();

      await uploadPYQ(req, res);

      expect(mockPYQConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          uploadedBy: '60d0fe4f5311236168a109ca',
        })
      );
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
        { subject: 'Math', year: 2024 },
        { subject: 'Physics', year: 2023 },
      ];
      mockSort.mockResolvedValue(pyqs);
      mockFind.mockReturnValue({ sort: mockSort });

      await getPYQs(req, res);

      expect(mockFind).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(pyqs);
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
});
