import createError from "../utils/createError.js";
import mongoose from "mongoose";

class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }

  // Los query params ya llegan validados (middleware con Zod).
  // Acá solo se arma la respuesta paginada.
  async getServices(options = {}) {
    const { page = 1, limit = 10 } = options;

    const { docs, total } = await this.repository.getAll(options);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      services: docs,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        hasPrevPage,
        hasNextPage,
      },
    };
  }

  async getServiceById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError("Id no valido", 400);
    }
    const service = await this.repository.getById(id);
    if (!service) {
      throw createError("Servicio no encontrado", 404);
    }
    return service;
  }

  async createService(serviceData) {
    return this.repository.create(serviceData);
  }

  async updateService(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError("Id no valido", 400);
    }

    const updateService = await this.repository.update(id, updateData);

    if (!updateService) {
      throw createError("Servicio no encontrado", 404);
    }

    return updateService;
  }

  async deleteService(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError("Id no valido", 400);
    }

    const deleteService = await this.repository.delete(id);

    if (!deleteService) {
      throw createError("Servicio no encontrado", 404);
    }
    return deleteService;
  }
}

export default ServicesService;
