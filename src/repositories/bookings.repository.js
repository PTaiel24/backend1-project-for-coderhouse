import BookingsDAO from "../dao/bookings.dao.js";

const bookingsDao = new BookingsDAO();

class BookingsRepository {
  constructor() {
    this.dao = bookingsDao;
  }

  async create(bookingData) {
    return this.dao.create(bookingData);
  }

  async getById(id) {
    return this.dao.getById(id);
  }

  async update(id, updateData) {
    return this.dao.update(id, updateData);
  }
}

export default BookingsRepository;
