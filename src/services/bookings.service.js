import createError from "../utils/createError.js";
import mongoose from "mongoose";

const BOOKING_UPDATE_FIELDS = [
  "clientName",
  "clientEmail",
  "date",
  "time",
  "status",
];

const getDateError = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (typeof date !== "string" || !dateRegex.test(date)) {
    return "La fecha debe tener el formato YYYY-MM-DD";
  }

  const [year, month, day] = date.split("-").map(Number);

  const dateObject = new Date(year, month - 1, day);

  if (
    dateObject.getFullYear() !== year ||
    dateObject.getMonth() !== month - 1 ||
    dateObject.getDate() !== day
  ) {
    return "La fecha no es válida";
  }

  return null;
};

const getTimeError = (time) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (typeof time !== "string" || !timeRegex.test(time)) {
    return "La hora debe tener el formato HH:mm";
  }

  return null;
};

const validateBookingUpdate = (updateData) => {
  if (
    !updateData ||
    typeof updateData !== "object" ||
    Array.isArray(updateData)
  ) {
    throw createError("Debe enviar al menos un campo para actualizar", 400);
  }

  const data = Object.fromEntries(
    BOOKING_UPDATE_FIELDS.filter((field) =>
      Object.hasOwn(updateData, field),
    ).map((field) => [field, updateData[field]]),
  );

  if (Object.keys(data).length === 0) {
    throw createError(
      "Debe enviar al menos un campo válido para actualizar (clientName, clientEmail, date, time o status)",
      400,
    );
  }

  const errors = [];

  ["clientName", "clientEmail", "status"].forEach((field) => {
    if (
      Object.hasOwn(data, field) &&
      (typeof data[field] !== "string" || data[field].trim() === "")
    ) {
      errors.push(`${field} debe de ser un string no vacio`);
    }
  });

  if (Object.hasOwn(data, "date")) {
    const dateError = getDateError(data.date);

    if (dateError) errors.push(dateError);
  }

  if (Object.hasOwn(data, "time")) {
    const timeError = getTimeError(data.time);

    if (timeError) errors.push(timeError);
  }

  if (errors.length > 0) {
    throw createError(errors.join(" - "), 400);
  }

  ["clientName", "clientEmail", "status"].forEach((field) => {
    if (Object.hasOwn(data, field)) {
      data[field] = data[field].trim();
    }
  });

  return data;
};

class BookingsService {
  constructor(repository, services) {
    this.repository = repository;
    this.services = services;
  }

  async getBookings() {
    return this.repository.getAll();
  }

  async createBooking(bookingData) {
    if (
      bookingData === null ||
      typeof bookingData !== "object" ||
      Array.isArray(bookingData)
    ) {
      throw createError(
        "El cuerpo de la solicitud debe ser un objeto JSON",
        400,
      );
    }

    const { clientName, clientEmail, date, time } = bookingData;

    if (
      typeof clientName !== "string" ||
      clientName.trim() === "" ||
      typeof clientEmail !== "string" ||
      clientEmail.trim() === "" ||
      !date ||
      !time
    ) {
      throw createError("Todos los campos deben completarse", 400);
    }

    const dateError = getDateError(date);

    if (dateError) {
      throw createError(dateError, 400);
    }

    const timeError = getTimeError(time);

    if (timeError) {
      throw createError(timeError, 400);
    }

    const newBooking = {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
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

    const validatedData = validateBookingUpdate(updateData);

    const updatedBooking = await this.repository.update(id, validatedData);

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
