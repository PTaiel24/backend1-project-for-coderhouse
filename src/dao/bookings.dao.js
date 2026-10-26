import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import createError from "../utils/createError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_PATH = path.resolve(__dirname, "../data/bookings.json");

class BookingsDAO {
  constructor(filePath = DEFAULT_PATH) {
    this.filePath = filePath;
  }

  async #readFile() {
    try {
      const bookings = JSON.parse(await fs.readFile(this.filePath, "utf-8"));

      if (!Array.isArray(bookings)) {
        throw createError(
          "El archivo de reservas debe contener un array JSON",
          500,
        );
      }

      return bookings;
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      if (error.statusCode) {
        throw error;
      }
      throw createError("Error al leer las reservas", 500);
    }
  }

  async #writeFile(bookingData) {
    try {
      await fs.writeFile(
        this.filePath,
        JSON.stringify(bookingData, null, 2),
        "utf-8",
      );
    } catch {
      throw createError("Error al guardar las reservas", 500);
    }
  }

  #createId(bookings) {
    const ids = bookings.map((item) => item.id).sort((a, b) => a - b);

    let newId = 1;

    for (const id of ids) {
      if (newId === id) {
        newId++;
      } else if (newId < id) {
        break;
      }
    }
    return newId;
  }

  async create(bookingData) {
    const bookings = await this.#readFile();
    bookingData = {
      ...bookingData,
      id: this.#createId(bookings),
    };
    bookings.push(bookingData);
    await this.#writeFile(bookings);
    return bookingData;
  }

  async getById(id) {
    const bookings = await this.#readFile();
    return bookings.find((item) => item.id === id);
  }

  async update(id, updateData) {
    const bookings = await this.#readFile();
    const index = bookings.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    bookings[index] = {
      ...bookings[index],
      ...updateData,
      id: bookings[index].id,
    };

    await this.#writeFile(bookings);
    return bookings[index];
  }
}

export default BookingsDAO;
