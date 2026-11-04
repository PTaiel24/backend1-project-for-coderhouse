import sendError from "../utils/sendError.js";

class BookingController {
  constructor(bookings) {
    this.bookings = bookings;

    this.createBooking = this.createBooking.bind(this);
    this.getBookingById = this.getBookingById.bind(this);
    this.addServiceToBooking = this.addServiceToBooking.bind(this);
  }

  async createBooking(req, res) {
    try {
      const newBooking = await this.bookings.createBooking(req.body);
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
      const booking = await this.bookings.getBookingById(bid);
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
      const newBooking = await this.bookings.addServiceToBooking(bid, sid);
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
