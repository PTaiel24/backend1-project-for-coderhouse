import { Router } from "express";
import BookingController from "../controllers/bookings.controller.js";

const bookingController = new BookingController();
const router = Router();

router.post("/", bookingController.createBooking);

router.get("/:bid", bookingController.getBookingById);

router.post("/:bid/services/:sid", bookingController.addServiceToBooking);

export default router;
