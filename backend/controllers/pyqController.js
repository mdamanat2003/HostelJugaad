import PYQ from '../models/PYQ.js';

// Naya PYQ Upload karne ka logic
export const uploadPYQ = async (req, res) => {
  try {
    const { subject, code, examType, year } = req.body;

    if (!subject || !code || !examType || !year) {
      return res.status(400).json({ message: "All fields (subject, code, examType, year) are required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required." });
    }

    const fileUrl = req.file.path;

    const newPYQ = new PYQ({
      subject,
      code,
      examType,
      year,
      fileUrl,
      uploadedBy: req.user.userId,
    });

    await newPYQ.save();

    res.status(201).json({
      message: "PYQ Uploaded Successfully!",
      pyq: newPYQ,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
};

// Saare PYQs ko database se fetch karne ka logic (Frontend ko dikhane ke liye)
export const getPYQs = async (req, res) => {
  try {
    const pyqs = await PYQ.find().sort({ createdAt: -1 });
    res.status(200).json(pyqs);
  } catch (error) {
    console.error("Fetch PYQs Error:", error);
    res.status(500).json({ message: "Server error fetching PYQs" });
  }
};
