import { BookingModel } from "./models/booking.model.js";

class BookingsMongoDAO {
  async getAll() {
    return BookingModel.find()
      .sort({ createdAt: 1 })
      .populate("services.service")
      .lean();
  }

  async create(bookingData) {
    return BookingModel.create(bookingData);
  }

  async getById(id, { populate = false } = {}) {
    const query = BookingModel.findById(id);

    if (populate) {
      query.populate("services.service");
    }

    return query.lean();
  }

  async update(id, updateData) {
    return BookingModel.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    })
      .populate("services.service")
      .lean();
  }

  async delete(id) {
    return BookingModel.findByIdAndDelete(id).lean();
  }
}

export default BookingsMongoDAO;
