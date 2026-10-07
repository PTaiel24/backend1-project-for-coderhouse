/* BookingManager — maneja bookings.json con métodos: 
createBooking, 
getBookingById, 
addServiceToBooking. */

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
const DEFAULT_PATH = path.resolve(__dirname, "../data/bookings.json");

export class BookingManager {
  constructor(filePath = DEFAULT_PATH) {
    this.path = filePath;
  }

  async createBooking(bookingData) {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const booking = JSON.parse(data);

      const { clientName, clientEmail, date, time } = bookingData;
      if (!clientName || !clientEmail || !date || !time) {
        throw createError("Todos los campos deben completarse", 400);
      }

      // 2. Validar formato de fecha
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!dateRegex.test(date)) {
        throw createError("La fecha debe tener el formato YYYY-MM-DD", 400);
      }

      // 3. Validar que la fecha realmente exista
      const [year, month, day] = date.split("-").map(Number);

      const dateObject = new Date(year, month - 1, day);

      if (
        dateObject.getFullYear() !== year ||
        dateObject.getMonth() !== month - 1 ||
        dateObject.getDate() !== day
      ) {
        throw createError("La fecha no es válida", 400);
      }

      // 4. Validar formato de hora
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

      if (!timeRegex.test(time)) {
        throw createError("La hora debe tener el formato HH:mm", 400);
      }

      // 5. Separar hora y minutos
      const [hours, minutes] = time.split(":").map(Number);

      const ids = booking.map((item) => item.id).sort((a, b) => a - b);
      let newId = 1;
      for (const id of ids) {
        if (newId === id) {
          newId++;
        } else if (newId < id) {
          break;
        }
      }

      const newBooking = {
        id: newId,
        clientName,
        clientEmail,
        date,
        time,
        status: "success",
        services: [],
      };

      booking.push(newBooking);
      await fs.writeFile(this.path, JSON.stringify(booking, null, 2), "utf-8");
      return newBooking;
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw createError("Error al leer los servicios", 500);
    }
  }

  async getBookingById(id) {
    const data = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const booking = data.find((item) => item.id === id);
    if (!booking) {
      throw createError("Reserva no encontrada", 404);
    }
    return booking;
  }

  async addServiceToBooking(bid, sid) {
    try {
      const booking = JSON.parse(await fs.readFile(this.path, "utf-8"));
      const bookingIndex = booking.findIndex((item) => item.id === bid);
      if (bookingIndex === -1) {
        throw createError("Reserva no encontrada", 404);
      }
      const serviceIndex = booking[bookingIndex].services.findIndex(
        (item) => item.service === sid,
      );
      if (serviceIndex !== -1) {
        booking[bookingIndex].services[serviceIndex].quantity += 1;
      } else {
        booking[bookingIndex].services.push({
          service: sid,
          quantity: 1,
        });
      }
      await fs.writeFile(this.path, JSON.stringify(booking, null, 2), "utf-8");
      return booking[bookingIndex];
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw createError("Error al leer los servicios", 500);
    }
  }
}
