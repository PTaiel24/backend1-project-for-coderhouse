class BookingsRepository {
  constructor(dao) {
    this.dao = dao;
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
