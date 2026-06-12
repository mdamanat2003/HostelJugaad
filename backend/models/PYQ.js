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
    course: {
      type: String,
      default: '',
    },
    branch: {
      type: String,
      default: '',
    },
    semester: {
      type: String,
      default: '',
    },
    examType: {
      type: String,
      required: true,
      enum: ['midsem1', 'midsem2', 'endsem', 'classtest', 'other'],
      default: 'midsem1',
    },
    year: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PYQ = mongoose.model('PYQ', pyqSchema);
export default PYQ;
