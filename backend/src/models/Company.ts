import mongoose, { Schema } from "mongoose";
import { ICompany } from "../types/ICompany";

const CompanySchema: Schema<ICompany> = new Schema({
  userId: { type: String, require: true },
  jobId: { type: String, require: true },
  companyName: { type: String, required: true },
  url: { type: String, unique: true },
  mobileNumber: { type: String },
  address: { type: String },
  email: { type: String },
  description:{ type: String}
});

export const Company = mongoose.model<ICompany>("Company", CompanySchema);
