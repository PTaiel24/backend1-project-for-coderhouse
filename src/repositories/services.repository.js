class ServicesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll(options = {}) {
    return this.dao.getAll(options);
  }

  async getById(id) {
    return this.dao.getById(id);
  }

  async create(serviceData) {
    return this.dao.create(serviceData);
  }

  async update(id, updateData) {
    return this.dao.update(id, updateData);
  }

  async delete(id) {
    return this.dao.delete(id);
  }
}

export default ServicesRepository;
