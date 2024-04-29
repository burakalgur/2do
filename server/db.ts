// db.ts

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/todo');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB can not connect', error);
    process.exit(1);
  }
};

export default connectDB;
