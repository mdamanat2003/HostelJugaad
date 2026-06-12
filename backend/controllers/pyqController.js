import PYQ from '../models/PYQ.js';

// Naya PYQ Upload karne ka logic
export const uploadPYQ = async (req, res) => {
  try {
    const { subject, code, examType, year, uploaderId } = req.body;

    // Check karein ki frontend ne file bheji hai ya nahi
    if (!req.file) {
      return res.status(400).json({ message: "Bhai, file toh select karo!" });
    }

    // Cloudinary ne jo file save ki hai, uska URL multer automatically req.file.path mein daal deta hai
    const fileUrl = req.file.path;

    // Database mein naya record banana
    const newPYQ = new PYQ({
      subject,
      code,
      examType,
      year,
      fileUrl,
      // Abhi authentication nahi lagaya hai, toh koi dummy user ID use kar lenge agar uploaderId nahi aayi
      uploadedBy: uploaderId || "60d0fe4f5311236168a109ca" 
    });

    await newPYQ.save();

    res.status(201).json({
      message: "PYQ Uploaded Successfully!",
      pyq: newPYQ,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error during upload", error: error.message });
  }
};

// Saare PYQs ko database se fetch karne ka logic (Frontend ko dikhane ke liye)
export const getPYQs = async (req, res) => {
  try {
    // Database se saare PYQs nikalna, naye wale sabse upar (sort by createdAt)
    const pyqs = await PYQ.find().sort({ createdAt: -1 });
    res.status(200).json(pyqs);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching PYQs" });
  }
};