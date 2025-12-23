import { Types } from "mongoose";

export interface IBooking {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  serviceId: Types.ObjectId;
  selectedDate: string;
  selectedTimes: string[];
  status?: "pending" | "confirmed" | "rejected";
}
