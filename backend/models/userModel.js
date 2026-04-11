import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // removes extra spaces automatically
  },
  email: {
    type: String,
    required: true,
    unique: true, // ✅ only email is unique
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
