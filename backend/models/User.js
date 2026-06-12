import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ek email se ek hi account banega
    },
    password: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
    studentType: {
      type: String,
      enum: ['Hosteler', 'Day Scholar'], // In dono ke alawa kuch accept nahi hoga
      default: 'Hosteler',
    },
    rollNumber: {
      type: String,
      required: true,
    },
    hostelBlock: {
      type: String,
      required: function() { return this.studentType === 'Hosteler'; } // Sirf Hosteler ke liye zaroori
    },
    roomNumber: {
      type: String,
      required: function() { return this.studentType === 'Hosteler'; } // Sirf Hosteler ke liye zaroori
    },
    jugaadPoints: {
      type: Number,
      default: 0, // Naye user ko 0 points milenge
    }
  },
  {
    timestamps: true, // createdAt aur updatedAt automatically add ho jayega
  }
);

const User = mongoose.model('User', userSchema);
export default User;