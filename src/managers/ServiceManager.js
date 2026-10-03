import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_PATH = path.resolve(__dirname, "../data/services.json");

export class ServiceManager {
  constructor(filePath = DEFAULT_PATH) {
    this.path = filePath;
  }

  /* Obtener los servicios */
  async getServices({ category, available } = {}) {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      let services = JSON.parse(data);
      if (category) {
        services = services.filter((item) => item.category === category);
      }
      if (available !== undefined) {
        if (available !== "true" && available !== "false") {
          throw createError("El filtro tiene que ser 'true' o 'false'", 400);
        }
        services = services.filter(
          (item) => String(item.available) === available,
        );
      }

      return services;
    } catch (error) {
      if (error.code === "ENOENT") {
        await fs.writeFile(this.path, JSON.stringify([], null, 2), "utf-8");
        return [];
      }

      if (error.statusCode) {
        throw error;
      }
      throw createError("Error al leer los servicios", 500);
    }
  }

  /* Obtener servicio por id */
  async getServiceById(id) {
    const services = await this.getServices();
    const service = services.find((item) => item.id === id);
    if (!service) {
      throw createError(`El servicio con id: ${id}, no encontrado`, 404);
    }
    return service;
  }

  /* Agregar servicio */
  async addService(serviceData) {
    const { name, description, duration, price, category, available } =
      serviceData;
    if (
      !name ||
      !description ||
      duration === undefined ||
      price === undefined ||
      !category ||
      available === undefined
    ) {
      throw createError(
        `Todos los campos deben completarse correctamente`,
        400,
      );
    }
    if (available !== true && available !== false) {
      throw createError(
        "Available debe de ser 'true' o 'false' de forma Booleana",
        400,
      );
    }
    const services = await this.getServices();

    /* Genera un id con dos casos, si queda un hueco agarra el id de ese hueco,
    en caso contrario agarra el id mas alto y suma uno */
    const ids = services.map((obj) => obj.id).sort((a, b) => a - b);
    let newId = 1;
    for (const id of ids) {
      if (newId === id) {
        newId++;
      } else if (id > newId) {
        break;
      }
    }

    const newService = {
      id: newId,
      name: String(name),
      description: String(description),
      duration: Number(duration),
      price: Number(price),
      category: String(category),
      available: available,
    };

    services.push(newService);
    await fs.writeFile(this.path, JSON.stringify(services, null, 2), "utf-8");
    return newService;
  }

  /* Actualiza servicio existente */
  async updateService(id, updatedData) {
    const services = await this.getServices();
    const index = services.findIndex((item) => item.id === id);

    if (index === -1) {
      throw createError(`Servicio no encontrado`, 404);
    }

    services[index] = {
      ...services[index],
      ...updatedData,
      id: services[index].id,
    };

    await fs.writeFile(this.path, JSON.stringify(services, null, 2), "utf-8");
    return services[index];
  }

  /* Elimina servicio */
  async deleteService(id) {
    const services = await this.getServices();
    const index = services.findIndex((item) => item.id === id);
    if (index === -1) {
      throw createError(`Servicio no encontrado`, 404);
    }

    const deletedService = services[index];
    services.splice(index, 1);
    await fs.writeFile(this.path, JSON.stringify(services, null, 2), "utf-8");
    return deletedService;
  }
}
