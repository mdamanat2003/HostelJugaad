import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // MongoDB se connect karne ki koshish
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Agar error aaye toh server ko turant band kar do
  }
};

export default connectDB;