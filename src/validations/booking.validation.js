import { z } from "zod";
import {
  withMessage,
  requiredString,
  objectIdString,
  atLeastOneField,
  atLeastOne,
  BODY_MESSAGE,
} from "./shared.validation.js";

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

const isRealDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const bookingFields = {
  clientName: requiredString("clientName"),
  clientEmail: requiredString("clientEmail").email(
    "clientEmail debe ser un email válido",
  ),
  date: z
    .string(withMessage(
        "date debe ser un texto con formato YYYY-MM-DD",
        "date es obligatorio",
      ))
    .regex(DATE_FORMAT, "date debe tener el formato YYYY-MM-DD")
    .refine(
      (value) => !DATE_FORMAT.test(value) || isRealDate(value),
      "date no es una fecha válida",
    ),
  time: z
    .string(withMessage(
        "time debe ser un texto con formato HH:mm",
        "time es obligatorio",
      ))
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "time debe tener el formato HH:mm"),
};

// POST /api/bookings
// El estado inicial y el array de servicios los define el service,
// por eso no se aceptan desde el body.
export const createBookingSchema = z.object(
  bookingFields,
  withMessage(BODY_MESSAGE),
);

// PUT /api/bookings/:bid (se puede enviar solo una parte de los campos)
export const updateBookingSchema = z
  .object(
    { ...bookingFields, status: requiredString("status") },
    withMessage(BODY_MESSAGE),
  )
  .partial()
  .refine(
    atLeastOneField,
  atLeastOne,
    "Debe enviar al menos un campo válido para actualizar (clientName, clientEmail, date, time o status)",
  );

// POST /api/bookings/:bid/services/:sid
export const addServiceToBookingParamsSchema = z.object({
  bid: objectIdString("El id de la reserva (bid)"),
  sid: objectIdString("El id del servicio (sid)"),
});
