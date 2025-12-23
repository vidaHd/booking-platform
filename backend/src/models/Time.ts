import mongoose, { Schema } from "mongoose";
import { ITime } from "../types/ITime";

const TimeSchema = new Schema<ITime>({
  companyId: { type: String, required: true },
  day: { type: String, required: true },
  times: [String], // Array of time strings like ["9:00", "10:00", "14:00"]
});

export const Time = mongoose.model<ITime>("availableTime", TimeSchema);
