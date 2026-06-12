import { jest } from '@jest/globals';

// Mock dependencies before importing the controller
const mockFindOne = jest.fn();
const mockSave = jest.fn();
const mockUserConstructor = jest.fn();

jest.unstable_mockModule('../models/User.js', () => {
  const MockUser = function (data) {
    mockUserConstructor(data);
    this._id = 'mock-user-id';
    this.name = data.name;
    this.email = data.email;
    this.collegeName = data.collegeName;
    this.studentType = data.studentType;
    this.save = mockSave;
  };
  MockUser.findOne = mockFindOne;
  return { default: MockUser };
});

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn(),
  },
}));

const { register, login } = await import('../controllers/authController.js');
const bcrypt = (await import('bcryptjs')).default;
const jwt = (await import('jsonwebtoken')).default;

describe('authController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      collegeName: 'Test College',
      studentType: 'Hosteler',
      rollNumber: 'TC001',
      hostelBlock: 'A',
      roomNumber: '101',
    };

    it('should register a new user successfully', async () => {
      req.body = validBody;
      mockFindOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_password');
      mockSave.mockResolvedValue();
      jwt.sign.mockReturnValue('mock_token');

      await register(req, res);

      expect(mockFindOne).toHaveBeenCalledWith({ email: validBody.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(validBody.password, 10);
      expect(mockSave).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Registration Successful!',
          token: 'mock_token',
          user: expect.objectContaining({
            name: validBody.name,
            email: validBody.email,
          }),
        })
      );
    });

    it('should return 400 if email already exists', async () => {
      req.body = validBody;
      mockFindOne.mockResolvedValue({ email: validBody.email });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email pehle se registered hai!',
      });
    });

    it('should set hostelBlock and roomNumber to null for Day Scholar', async () => {
      req.body = { ...validBody, studentType: 'Day Scholar' };
      mockFindOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_password');
      mockSave.mockResolvedValue();
      jwt.sign.mockReturnValue('mock_token');

      await register(req, res);

      expect(mockUserConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          hostelBlock: null,
          roomNumber: null,
        })
      );
    });

    it('should return 500 on server error', async () => {
      req.body = validBody;
      mockFindOne.mockRejectedValue(new Error('DB error'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Registration failed',
        })
      );
    });
  });

  describe('login', () => {
    const validCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      _id: 'mock-user-id',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password',
      collegeName: 'Test College',
      studentType: 'Hosteler',
    };

    it('should login successfully with valid credentials', async () => {
      req.body = validCredentials;
      mockFindOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock_token');

      await login(req, res);

      expect(mockFindOne).toHaveBeenCalledWith({ email: validCredentials.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(validCredentials.password, mockUser.password);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login Successful!',
          token: 'mock_token',
          user: expect.objectContaining({
            id: mockUser._id,
            name: mockUser.name,
            email: mockUser.email,
          }),
        })
      );
    });

    it('should return 401 if user not found', async () => {
      req.body = validCredentials;
      mockFindOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email ya password galat hai!',
      });
    });

    it('should return 401 if password is invalid', async () => {
      req.body = validCredentials;
      mockFindOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email ya password galat hai!',
      });
    });

    it('should return 500 on server error', async () => {
      req.body = validCredentials;
      mockFindOne.mockRejectedValue(new Error('DB error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login failed',
        })
      );
    });
  });
});
