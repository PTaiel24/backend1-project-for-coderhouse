import { Router } from "express";
import BookingController from "../controllers/bookings.controller.js";
import BookingsService from "../services/bookings.service.js";
import BookingsRepository from "../repositories/bookings.repository.js";
import BookingsMongoDAO from "../dao/bookings.mongo.dao.js";

import ServicesService from "../services/services.service.js";
import ServicesRepository from "../repositories/services.repository.js";
import ServicesMongoDAO from "../dao/services.mongo.dao.js";

import {
  validateBody,
  validateParams,
} from "../middlewares/validate.middleware.js";
import {
  createBookingSchema,
  updateBookingSchema,
  addServiceToBookingParamsSchema,
} from "../validations/booking.validation.js";

const servicesDao = new ServicesMongoDAO();
const servicesRepository = new ServicesRepository(servicesDao);
const services = new ServicesService(servicesRepository);

const bookingsDao = new BookingsMongoDAO();
const bookingsRepository = new BookingsRepository(bookingsDao);
const bookings = new BookingsService(bookingsRepository, services);
const bookingController = new BookingController(bookings);

const router = Router();

router.get("/", bookingController.getBookings);

router.post(
  "/",
  validateBody(createBookingSchema),
  bookingController.createBooking,
);

router.get("/:bid", bookingController.getBookingById);

router.put(
  "/:bid",
  validateBody(updateBookingSchema),
  bookingController.updateBooking,
);

router.delete("/:bid", bookingController.deleteBooking);

router.post(
  "/:bid/services/:sid",
  validateParams(addServiceToBookingParamsSchema),
  bookingController.addServiceToBooking,
);

export default router;
