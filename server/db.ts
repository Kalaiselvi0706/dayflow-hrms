import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexora-hr';

export async function connectDB() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB successfully connected.');
  } catch (err: any) {
    console.error('MongoDB connection failed:', err.message);
    console.error('Please verify your MongoDB daemon is running locally or specify MONGO_URI in your .env file.');
    // Do not crash the server in local developer environment so compilation and other static tasks still pass.
  }
}
