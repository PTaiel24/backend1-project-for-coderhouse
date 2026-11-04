class ServicesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll({ category, available } = {}) {
    return this.dao.getAll({ category, available });
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
