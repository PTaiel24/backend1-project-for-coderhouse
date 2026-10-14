import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager.js";
import sendError from "../utils/sendError.js";

class BookingController {
  constructor() {
    this.bookingManager = new BookingManager();
    this.serviceManager = new ServiceManager();

    this.createBooking = this.createBooking.bind(this);
    this.getBookingById = this.getBookingById.bind(this);
    this.addServiceToBooking = this.addServiceToBooking.bind(this);
  }

  async createBooking(req, res) {
    try {
      const newBooking = await this.bookingManager.createBooking(req.body);
      res.status(201).json({
        status: "success",
        payload: newBooking,
      });
    } catch (error) {
      return sendError(error, res);
    }
  }

  async getBookingById(req, res) {
    try {
      const { bid } = req.params;
      const booking = await this.bookingManager.getBookingById(Number(bid));
      res.status(200).json({
        status: "success",
        payload: booking,
      });
    } catch (error) {
      return sendError(error, res);
    }
  }

  async addServiceToBooking(req, res) {
    try {
      const { bid, sid } = req.params;
      const booking = await this.bookingManager.getBookingById(Number(bid));
      const service = await this.serviceManager.getServiceById(Number(sid));
      const newBooking = await this.bookingManager.addServiceToBooking(
        booking.id,
        service.id,
      );
      res.status(201).json({
        status: "success",
        payload: newBooking,
      });
    } catch (error) {
      return sendError(error, res);
    }
  }
}

export default BookingController;
