import mongoose from 'mongoose';

export async function connectDb() {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/medisys';

    await mongoose.connect(MONGODB_URI);

    console.log('✅ MongoDB connected successfully');

    return mongoose;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

export function disconnectDb() {
  return mongoose.disconnect();
}
