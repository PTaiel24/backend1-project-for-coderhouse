import sendError from "../utils/sendError.js";
import emitEvent from "../utils/emitEvent.js";

class BookingController {
  constructor(bookings) {
    this.bookings = bookings;

    this.getBookings = this.getBookings.bind(this);
    this.createBooking = this.createBooking.bind(this);
    this.getBookingById = this.getBookingById.bind(this);
    this.updateBooking = this.updateBooking.bind(this);
    this.deleteBooking = this.deleteBooking.bind(this);
    this.addServiceToBooking = this.addServiceToBooking.bind(this);
  }

  async getBookings(req, res) {
    try {
      const bookings = await this.bookings.getBookings();
      res.status(200).json({
        status: "success",
        payload: bookings,
      });
    } catch (error) {
      return sendError(error, res);
    }
  }

  async createBooking(req, res) {
    try {
      const newBooking = await this.bookings.createBooking(req.body);

      emitEvent(req, "bookingCreated", newBooking);

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

  async updateBooking(req, res) {
    try {
      const { bid } = req.params;
      const updatedBooking = await this.bookings.updateBooking(bid, req.body);

      emitEvent(req, "bookingUpdated", updatedBooking);

      res.status(200).json({
        status: "success",
        payload: updatedBooking,
      });
    } catch (error) {
      return sendError(error, res);
    }
  }

  async deleteBooking(req, res) {
    try {
      const { bid } = req.params;
      const deletedBooking = await this.bookings.deleteBooking(bid);

      emitEvent(req, "bookingDeleted", bid);

      res.status(200).json({
        status: "success",
        payload: deletedBooking,
      });
    } catch (error) {
      return sendError(error, res);
    }
  }

  async addServiceToBooking(req, res) {
    try {
      const { bid, sid } = req.params;
      const newBooking = await this.bookings.addServiceToBooking(bid, sid);

      emitEvent(req, "bookingUpdated", newBooking);

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
