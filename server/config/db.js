import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securedoc';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[Database] MongoDB not reachable at ${mongoURI}. Running in localized hybrid memory mode.`);
  }
};
