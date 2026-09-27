import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_PATH = path.resolve(__dirname, "../data/services.json");

export class ServiceManager {
  constructor(filePath = DEFAULT_PATH) {
    this.path = filePath;
  }

  /* Obtener los servicios */
  async getServices() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        await fs.writeFile(this.path, JSON.stringify([], null, 2), "utf-8");
        return [];
      }
      throw new Error(`Error al leer los servicios: ${error.message}`);
    }
  }

  /* Obtener servicio por id */
  async getServiceById(id) {
    const services = await this.getServices();
    const service = services.find((item) => item.id === id);
    if (!service) {
      throw new Error(`El servicio con id: ${id}, no encontrado`);
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
      throw new Error(`Todos los campos deben completarse`);
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
      available: Boolean(available),
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
      throw new Error(`Servicio no encontrado`);
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
      throw new Error(`Servicio no encontrado`);
    }

    const deletedService = services.splice(index, 1);
    await fs.writeFile(this.path, JSON.stringify(services, null, 2), "utf-8");
    return deletedService;
  }
}
