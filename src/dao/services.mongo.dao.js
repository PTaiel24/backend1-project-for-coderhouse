import { ServiceModel } from "./models/service.model.js";

class ServicesMongoDAO {
  async getAll({
    category,
    available,
    page = 1,
    limit = 10,
    sortBy,
    order = "asc",
  } = {}) {
    const filters = {};

    if (category) {
      filters.category = category;
    }
    if (available !== undefined) {
      filters.available = available;
    }

    // _id como segundo criterio para que el orden sea estable entre páginas
    const direction = order === "desc" ? -1 : 1;
    const sort = sortBy ? { [sortBy]: direction, _id: 1 } : { _id: 1 };

    const [docs, total] = await Promise.all([
      ServiceModel.find(filters)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ServiceModel.countDocuments(filters),
    ]);

    return { docs, total };
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
