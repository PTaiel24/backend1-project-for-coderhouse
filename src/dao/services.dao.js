import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import createError from "../utils/createError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_PATH = path.resolve(__dirname, "../data/services.json");

class ServicesDAO {
  constructor(filePath = DEFAULT_PATH) {
    this.filePath = filePath;
  }

  async #readFiles() {
    try {
      const services = JSON.parse(await fs.readFile(this.filePath, "utf-8"));

      if (!Array.isArray(services)) {
        throw createError(
          "El archivo de servicios debe contener un array JSON",
          500,
        );
      }

      return services;
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      if (error.statusCode) {
        throw error;
      }
      throw createError("Error al leer los servicios", 500);
    }
  }

  async #writeFile(servicesData) {
    try {
      await fs.writeFile(
        this.filePath,
        JSON.stringify(servicesData, null, 2),
        "utf-8",
      );
    } catch {
      throw createError("Error al guardar los archivos", 500);
    }
  }

  #createID(services) {
    const ids = services.map((item) => item.id).sort((a, b) => a - b);

    let nextId = 1;

    for (const id of ids) {
      if (nextId === id) {
        nextId++;
      } else if (nextId < id) {
        break;
      }
    }
    return nextId;
  }

  async getAll() {
    return this.#readFiles();
  }

  async getById(id) {
    const services = await this.#readFiles();
    return services.find((item) => item.id === id) ?? null;
  }

  async create(serviceData) {
    const services = await this.#readFiles();
    const newService = { ...serviceData, id: this.#createID(services) };

    services.push(newService);
    await this.#writeFile(services);
    return newService;
  }

  async update(id, serviceData) {
    const services = await this.#readFiles();
    const index = services.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    services[index] = {
      ...services[index],
      ...serviceData,
      id: services[index].id,
    };
    await this.#writeFile(services);
    return services[index];
  }

  async delete(id) {
    const services = await this.#readFiles();
    const index = services.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }
    const [deleteService] = services.splice(index, 1);
    await this.#writeFile(services);
    return deleteService;
  }
}

export default ServicesDAO;
