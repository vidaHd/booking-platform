import { Types } from "mongoose";

export interface ICompany extends Document {
  userId: string;
  jobId?: Types.ObjectId;
  companyName: string;
  url: string;
  mobileNumber: string;
  address: string;
  email: string;
  description: string;
}
