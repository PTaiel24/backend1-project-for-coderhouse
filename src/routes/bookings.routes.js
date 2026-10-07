import { Router } from "express";
import { BookingManager } from "../managers/BookingManager.js";
import { ServiceManager } from "../managers/ServiceManager.js";

const bookingManager = new BookingManager();
const router = Router();
const serviceManager = new ServiceManager();

const sendError = (error, res) => {
  res.status(error.statusCode || 500).json({
    status: "error",
    message: error.message,
  });
};

router.post("/", async (req, res) => {
  try {
    const newBooking = await bookingManager.createBooking(req.body);
    res.status(201).json({
      status: "success",
      payload: newBooking,
    });
  } catch (error) {
    throw sendError(error, res);
  }
});

router.get("/:bid", async (req, res) => {
  try {
    const { bid } = req.params;
    const booking = await bookingManager.getBookingById(Number(bid));
    res.status(200).json({
      status: "success",
      payload: booking,
    });
  } catch (error) {
    throw sendError(error, res);
  }
});

router.post("/:bid/services/:sid", async (req, res) => {
  try {
    const { bid, sid } = req.params;
    const booking = await bookingManager.getBookingById(Number(bid));
    const service = await serviceManager.getServiceById(Number(sid));
    const newBooking = await bookingManager.addServiceToBooking(
      booking.id,
      service.id,
    );
    res.status(201).json({
      status: "success",
      payload: newBooking,
    });
  } catch (error) {
    throw sendError(error, res);
  }
});

export default router;
