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

    return ServiceModel.find(filters).lean();
  }

  async getById(id) {
    return ServiceModel.findById(id).lean();
  }

  async create(serviceData) {
    return ServiceModel.create(serviceData);
  }

  async update(id, updateData) {
    return ServiceModel.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    }).lean();
  }

  async delete(id) {
    return ServiceModel.findByIdAndDelete(id).lean();
  }
}

export default ServicesMongoDAO;
