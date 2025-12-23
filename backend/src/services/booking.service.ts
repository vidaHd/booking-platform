import { Types } from "mongoose";
import { Booking } from "../models/Booking";
import { IBooking } from "../types/IBooking";

export const bookingService = {
  async createBooking(data: IBooking) {
    const booking = new Booking(data);
    return await booking.save();
  },

  async getAllBookings(filters?: { companyId?: Types.ObjectId }) {
    const query: Record<string, any> = {};
    if (filters?.companyId) query.companyId = filters.companyId;

    return await Booking.find(query)
      .populate("userId", "name mobileNumber")
      .populate("serviceId", "title price duration");
  },

  async getBookingById(id: string) {
    return await Booking.findById(id)
      .populate("userId", "name mobileNumber")
      .populate("serviceId", "title price duration");
  },

  async deleteBooking(id: string) {
    return await Booking.findByIdAndDelete(id);
  },

  async getReservedTimesByCompany(companyId: Types.ObjectId, date: string) {
    return await Booking.find({
      companyId,
      selectedDate: date,
    });
  },

  async getUserBookings(companyId: Types.ObjectId, userId: Types.ObjectId) {
    return await Booking.find({ companyId, userId })
      .populate("serviceId", "title price duration")
      .populate("companyId", "name");
  },

  async updateBookingStatus(id: string, status: string) {
    if (status === "rejected") {
      const booking = await Booking.findById(id)
        .populate("userId", "name mobileNumber")
        .populate("serviceId", "title price duration");

      if (!booking) {
        return null;
      }

      await booking.deleteOne();
      booking.set("status", status, { strict: false });
      return booking;
    }

    return await Booking.findByIdAndUpdate(id, { status }, { new: true })
      .populate("userId", "name mobileNumber")
      .populate("serviceId", "title price duration");
  },
};
