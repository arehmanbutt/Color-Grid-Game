import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_picture_url: { type: String, default: "" },
  coins: { type: Number, default: 1000 },
});

const User = mongoose.model("User", userSchema);
export default User;
