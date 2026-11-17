class BookingsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return this.dao.getAll();
  }

  async create(bookingData) {
    return this.dao.create(bookingData);
  }

  async getById(id, options) {
    return this.dao.getById(id, options);
  }

  async update(id, updateData) {
    return this.dao.update(id, updateData);
  }

  async delete(id) {
    return this.dao.delete(id);
  }
}

export default BookingsRepository;
