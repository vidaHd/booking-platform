import { Request, Response } from "express";
import { bookingService } from "../services/booking.service";
import { asyncHandler, successResponse } from "../helpers/response.helper";
import { Types } from "mongoose";
import { companyService } from "../services/company.service";
import { sendEmail } from "../helpers/email.helper";

export const bookingController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const { companyId, userId } = req.params;
    const { serviceId, selectedDate, selectedTimes } = req.body;

    const booking = await bookingService.createBooking({
      companyId: new Types.ObjectId(companyId),
      userId: new Types.ObjectId(userId),
      serviceId: new Types.ObjectId(serviceId),
      selectedDate,
      selectedTimes,
    });

    const company = await companyService.getCompanyById(companyId);
    if (company?.email) {
      await sendEmail(
        company.email,
        req.t("email.new_booking_subject"),
        req.t("email.new_booking_body", {
          companyName: company.companyName,
          selectedDate,
          selectedTimes,
        })
      );
    }

    successResponse(res, req.t("booking.created_success"), { data: booking });
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const bookings = await bookingService.getAllBookings({
      companyId: new Types.ObjectId(companyId),
    });

    successResponse(res, req.t("booking.fetched_success"), { data: bookings });
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const booking = await bookingService.getBookingById(bookingId);

    successResponse(res, req.t("booking.fetched_success"), { data: booking });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    await bookingService.deleteBooking(bookingId);

    successResponse(res, req.t("booking.deleted_success"));
  }),

  getReservedTimes: asyncHandler(async (req: Request, res: Response) => {
    const { companyId, date } = req.params;

    const reservedTimes = await bookingService.getReservedTimesByCompany(
      new Types.ObjectId(companyId),
      date
    );

    successResponse(res, req.t("booking.reserved_times_fetched"), {
      data: reservedTimes,
    });
  }),

  getUserBookings: asyncHandler(async (req: Request, res: Response) => {
    const { companyId, userId } = req.params;

    const bookings = await bookingService.getUserBookings(
      new Types.ObjectId(companyId),
      new Types.ObjectId(userId)
    );

    successResponse(res, req.t("booking.user_bookings_fetched"), {
      data: bookings,
    });
  }),

  updateBookingStatus: asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["pending", "confirmed", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const updatedBooking = await bookingService.updateBookingStatus(id, status);
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      return res.status(200).json({
        message:
          status === "rejected"
            ? "Booking rejected and removed successfully"
            : "Booking status updated successfully",
        data: updatedBooking,
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }),
};
