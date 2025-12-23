import { Router } from "express";
import { bookingController } from "../controllers/booking.controller";
import { validationMiddleware } from "../middleware";
import { CreateBookingDto } from "../dto/booking.dto";

const router = Router();

/**
 * Get bookings of the current user for a specific company
 */
router.get(
  "/bookings/reserveTime/:companyId/:userId/",
  bookingController.getUserBookings
);

/**
 * Create a new booking
 */
router.post(
  "/bookings/:companyId/:userId",
  validationMiddleware(CreateBookingDto),
  bookingController.create
);

/**
 * Get a specific booking by ID
 */
router.get("/bookings/:companyId", bookingController.getAll);

router.put("/bookings/bookingId/:id", bookingController.updateBookingStatus);

/**
 * Get reserved times for a company (for disabling)
 */
router.get("/bookings/:companyId/:date", bookingController.getReservedTimes);

/**
 * Delete a booking by ID
 */
router.delete("/bookings/:bookingId", bookingController.remove);

export default router;
