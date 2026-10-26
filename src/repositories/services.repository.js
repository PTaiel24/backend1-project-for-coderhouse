import ServicesDAO from "../dao/services.dao.js";

const servicesDAO = new ServicesDAO();

class ServicesRepository {
  constructor() {
    this.servicesDAO = servicesDAO;
  }

  async getAll({ category, available } = {}) {
    let services = await this.servicesDAO.getAll();

    if (category) {
      services = services.filter((item) => item.category === category);
    }
    if (available !== undefined) {
      services = services.filter(
        (item) => String(item.available) === available,
      );
    }

    return services;
  }

  async getById(id) {
    return this.servicesDAO.getById(id);
  }

  async create(serviceData) {
    return await this.servicesDAO.create(serviceData);
  }

  async update(id, updateData) {
    return await this.servicesDAO.update(id, updateData);
  }

  async delete(id) {
    return await this.servicesDAO.delete(id);
  }
}

export default ServicesRepository;
