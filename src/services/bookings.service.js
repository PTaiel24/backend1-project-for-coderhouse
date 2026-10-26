import BookingsRepository from "../repositories/bookings.repository.js";
import ServicesService from "../services/services.service.js";
import createError from "../utils/createError.js";

const bookingsRepository = new BookingsRepository();
const servicesService = new ServicesService();

class BookingsService {
  constructor() {
    this.repository = bookingsRepository;
    this.services = servicesService;
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

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) {
      throw createError("La fecha debe tener el formato YYYY-MM-DD", 400);
    }

    const [year, month, day] = date.split("-").map(Number);

    const dateObject = new Date(year, month - 1, day);

    if (
      dateObject.getFullYear() !== year ||
      dateObject.getMonth() !== month - 1 ||
      dateObject.getDate() !== day
    ) {
      throw createError("La fecha no es válida", 400);
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (typeof time !== "string" || !timeRegex.test(time)) {
      throw createError("La hora debe tener el formato HH:mm", 400);
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
    const booking = await this.repository.getById(id);

    if (!booking) {
      throw createError("Reserva no encontrada", 404);
    }
    return booking;
  }

  async addServiceToBooking(bid, sid) {
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
    const existingService = services.find((item) => item.service === sid);

    if (existingService) {
      existingService.quantity += 1;
    } else {
      services.push({ service: sid, quantity: 1 });
    }

    return this.repository.update(bid, {
      ...booking,
      services,
    });
  }
}

export default BookingsService;
