import mongoose, { Schema, model } from "mongoose";
import { IBooking } from "../types/IBooking";

const BookingSchema = new Schema<IBooking>(
  {
    selectedTimes: [{ type: String, required: true }],
    selectedDate: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Booking = model<IBooking>("Booking", BookingSchema);
