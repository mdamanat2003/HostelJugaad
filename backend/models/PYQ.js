import mongoose from 'mongoose';

const pyqSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    examType: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true, // Yahan Cloudinary ka link save hoga
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Yeh reference hai ki kis student ne upload kiya
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const PYQ = mongoose.model('PYQ', pyqSchema);
export default PYQ;