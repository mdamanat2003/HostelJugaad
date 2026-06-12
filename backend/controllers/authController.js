import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken, formatUserResponse } from '../utils/authHelpers.js';
import asyncHandler from '../utils/asyncHandler.js';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Register karne ka logic
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, collegeName, studentType, rollNumber, hostelBlock, roomNumber } = req.body;

  // Input validation
  if (!name || !email || !password || !collegeName || !studentType || !rollNumber) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (!['Hosteler', 'Day Scholar'].includes(studentType)) {
    return res.status(400).json({ message: "Invalid student type." });
  }

  if (studentType === 'Hosteler' && (!hostelBlock || !roomNumber)) {
    return res.status(400).json({ message: "Hostelers must provide hostelBlock and roomNumber" });
  }

  // Check karein ki email pehle se registered hai ya nahi
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email pehle se registered hai!" });
  }

  // Password ko hash karna (security ke liye)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Naya user create karna
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    collegeName,
    studentType,
    rollNumber,
    hostelBlock: studentType === 'Hosteler' ? hostelBlock : null,
    roomNumber: studentType === 'Hosteler' ? roomNumber : null,
  });

  await newUser.save();

  const token = generateToken(newUser);

  res.status(201).json({
    message: "Registration Successful!",
    token,
    user: formatUserResponse(newUser),
  });
});

// Login karne ka logic
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  // Check karein ki user database mein exist karata hai
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  // Password ko compare karna
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = generateToken(user);

  res.status(200).json({
    message: "Login Successful!",
    token,
    user: formatUserResponse(user),
  });
});
