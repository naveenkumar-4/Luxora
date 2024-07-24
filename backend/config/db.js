import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to mongoDB Successfully");
  } catch (err) { 
    console.log("Database error"); 
    console.log(err.message);
    process.exit(1);  
  }
};
