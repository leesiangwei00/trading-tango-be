import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  _id: String,
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  country: String,
  password: String,
  verifyEmail: Boolean,
});

export const User = mongoose.model("User", UserSchema);
