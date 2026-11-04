import { BookingModel } from "./models/booking.model.js";

class BookingsMongoDAO {
  async create(bookingData) {
    return BookingModel.create(bookingData);
  }

  async getById(id) {
    return BookingModel.findById(id);
  }

  async update(id, updateData) {
    return BookingModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }
}

export default BookingsMongoDAO;
