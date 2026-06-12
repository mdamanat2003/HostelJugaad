import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  collegeName: user.collegeName,
  studentType: user.studentType,
});
