import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register karne ka logic
export const register = async (req, res) => {
  try {
    const { name, email, password, collegeName, studentType, rollNumber, hostelBlock, roomNumber } = req.body;

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

    // JWT token banna
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: "Registration Successful!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        collegeName: newUser.collegeName,
        studentType: newUser.studentType,
      }
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// Login karne ka logic
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check karein ki user database mein exist karata hai
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email ya password galat hai!" });
    }

    // Password ko compare karna
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ya password galat hai!" });
    }

    // JWT token banna
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '30d' }
    );

    res.status(200).json({
      message: "Login Successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        collegeName: user.collegeName,
        studentType: user.studentType,
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
