import PYQ from '../models/PYQ.js';

export const uploadPYQ = async (req, res) => {
  try {
    const { subject, code, course, branch, semester, examType, year, isSolved } = req.body;

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
      course: course || '',
      branch: branch || '',
      semester: semester || '',
      examType,
      year,
      fileUrl,
      uploadedBy: req.user.userId,
      isSolved: isSolved === 'true' || isSolved === true,
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

export const getPYQs = async (req, res) => {
  try {
    const { course, branch, semester, year, examType, isSolved, search } = req.query;

    const query = {};

    if (course) query.course = course;
    if (branch) query.branch = branch;
    if (semester) query.semester = semester;
    if (year) query.year = year;
    if (examType) query.examType = examType;
    if (isSolved === 'true') query.isSolved = true;
    if (isSolved === 'false') query.isSolved = false;

    if (search) {
      const sanitized = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 100);
      query.$or = [
        { subject: { $regex: sanitized, $options: 'i' } },
        { code: { $regex: sanitized, $options: 'i' } },
        { course: { $regex: sanitized, $options: 'i' } },
        { branch: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const pyqs = await PYQ.find(query).sort({ createdAt: -1 }).limit(100);
    res.status(200).json(pyqs);
  } catch (error) {
    console.error("Fetch PYQs Error:", error);
    res.status(500).json({ message: "Server error fetching PYQs" });
  }
};

export const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    const pyq = await PYQ.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    if (!pyq) {
      return res.status(404).json({ message: "PYQ not found" });
    }

    res.status(200).json(pyq);
  } catch (error) {
    console.error("View Count Error:", error);
    res.status(500).json({ message: "Server error updating views" });
  }
};
