import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });

    console.log("DATABASE CONNECTED");
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
