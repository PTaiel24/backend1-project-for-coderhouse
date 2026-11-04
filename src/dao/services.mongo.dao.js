import { ServiceModel } from "./models/service.model.js";

class ServicesMongoDAO {
  async getAll({ category, available } = {}) {
    const filters = {};

    if (category) {
      filters.category = category;
    }
    if (available !== undefined) {
      filters.available = available === "true";
    }

    return ServiceModel.find(filters);
  }

  async getById(id) {
    return ServiceModel.findById(id);
  }

  async create(serviceData) {
    return ServiceModel.create(serviceData);
  }

  async update(id, updateData) {
    return ServiceModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return ServiceModel.findByIdAndDelete(id);
  }
}

export default ServicesMongoDAO;
