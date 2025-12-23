import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/IUser";

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  familyName: { type: String, require: true },
  mobileNumber: { type: String, require: true },
  password: { type: String, required: true },
  email: { type: String,required: true },
  profile: { age: Number, avatar: String, gender: String, description: String },
  resetCode: { type: String },
  newPasswordTemp: { type: String },
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false },
});

export const User = mongoose.model<IUser>("User", UserSchema);
