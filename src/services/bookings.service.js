import createError from "../utils/createError.js";
import mongoose from "mongoose";

class BookingsService {
  constructor(repository, services) {
    this.repository = repository;
    this.services = services;
  }

  async getBookings() {
    return this.repository.getAll();
  }

  // Los datos ya llegan validados (middleware con Zod): acá solo se
  // aplica la regla de negocio del estado inicial y los servicios vacíos.
  async createBooking(bookingData) {
    const { clientName, clientEmail, date, time } = bookingData;

    const newBooking = {
      clientName,
      clientEmail,
      date,
      time,
      status: "success",
      services: [],
    };

    return this.repository.create(newBooking);
  }

  async getBookingById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError("Id no valido", 400);
    }

    const booking = await this.repository.getById(id, { populate: true });

    if (!booking) {
      throw createError("Reserva no encontrada", 404);
    }
    return booking;
  }

  async updateBooking(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError("Id no valido", 400);
    }

    const updatedBooking = await this.repository.update(id, updateData);

    if (!updatedBooking) {
      throw createError("Reserva no encontrada", 404);
    }

    return updatedBooking;
  }

  async deleteBooking(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError("Id no valido", 400);
    }

    const deletedBooking = await this.repository.delete(id);

    if (!deletedBooking) {
      throw createError("Reserva no encontrada", 404);
    }

    return deletedBooking;
  }

  async addServiceToBooking(bid, sid) {
    if (!mongoose.Types.ObjectId.isValid(bid)) {
      throw createError("Id de reserva no valido", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(sid)) {
      throw createError("Id de servicio no valido", 400);
    }

    const booking = await this.repository.getById(bid);
    const service = await this.services.getServiceById(sid);

    if (!booking) {
      throw createError("Reserva no encontrada", 404);
    }
    if (!service) {
      throw createError("Servicio no encontrado", 404);
    }

    const services = Array.isArray(booking.services)
      ? [...booking.services]
      : [];
    const existingService = services.find(
      (item) => String(item.service) === String(sid),
    );

    if (existingService) {
      existingService.quantity += 1;
    } else {
      services.push({ service: sid, quantity: 1 });
    }

    return this.repository.update(bid, {
      services,
    });
  }
}

export default BookingsService;
