import createError from "../utils/createError.js";
import mongoose from "mongoose";

const SERVICE_FIELDS = [
  "name",
  "description",
  "duration",
  "price",
  "category",
  "available",
];

const validateServiceData = (serviceData, { partial = false } = {}) => {
  if (
    serviceData === null ||
    typeof serviceData !== "object" ||
    Array.isArray(serviceData)
  ) {
    throw createError("El cuerpo de la solicitud debe ser un objeto JSON", 400);
  }

  const { name, description, duration, price, category, available } =
    serviceData;

  const errors = [];
  const shouldValidate = (field) => {
    return !partial || Object.hasOwn(serviceData, field);
  };

  if (
    shouldValidate("name") &&
    (typeof name !== "string" || name.trim() === "")
  ) {
    errors.push("Name debe de ser un string no vacio");
  }
  if (
    shouldValidate("description") &&
    (typeof description !== "string" || description.trim() === "")
  ) {
    errors.push("Description debe de ser un string no vacio");
  }
  if (
    shouldValidate("category") &&
    (typeof category !== "string" || category.trim() === "")
  ) {
    errors.push("Category debe de ser un string no vacio");
  }
  if (
    shouldValidate("price") &&
    (typeof price !== "number" || !Number.isFinite(price) || price < 0)
  ) {
    errors.push("Price debe ser un número finito mayor o igual a cero");
  }
  if (
    shouldValidate("duration") &&
    (typeof duration !== "number" ||
      !Number.isFinite(duration) ||
      duration <= 0)
  ) {
    errors.push("Duration debe ser un número finito mayor a cero");
  }
  if (shouldValidate("available") && typeof available !== "boolean") {
    errors.push("Available debe ser un booleano (true o false)");
  }

  if (errors.length > 0) {
    throw createError(errors.join(" - "), 400);
  }
};

class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }

  async getServices(filters = {}) {
    const { available } = filters;

    if (available !== undefined && !["true", "false"].includes(available)) {
      throw createError("El filtro tiene que ser 'true' o 'false'", 400);
    }

    return this.repository.getAll(filters);
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
    validateServiceData(serviceData);

    const normalizedData = Object.fromEntries(
      SERVICE_FIELDS.map((field) => [field, serviceData[field]]),
    );

    return this.repository.create(normalizedData);
  }

  async updateService(id, updateData) {
    if (
      !updateData ||
      typeof updateData !== "object" ||
      Array.isArray(updateData) ||
      Object.keys(updateData).length === 0
    ) {
      throw createError("Debe enviar al menos un campo para actualizar", 400);
    }

    validateServiceData(updateData, { partial: true });

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
