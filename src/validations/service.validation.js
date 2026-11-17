import { z } from "zod";
import {
  withMessage,
  enumMessage,
  requiredString,
  atLeastOneField,
  atLeastOne,
  BODY_MESSAGE,
} from "./shared.validation.js";

const serviceFields = {
  name: requiredString("name"),
  description: requiredString("description"),
  duration: z
    .number(withMessage("duration debe ser un número", "duration es obligatorio"))
    .positive("duration debe ser mayor a cero"),
  price: z
    .number(withMessage("price debe ser un número", "price es obligatorio"))
    .min(0, "price debe ser mayor o igual a cero"),
  category: requiredString("category"),
  available: z
    .boolean(withMessage("available debe ser true o false"))
    .optional(),
};

// POST /api/services
export const createServiceSchema = z.object(
  serviceFields,
  withMessage(BODY_MESSAGE),
);

// PUT /api/services/:sid (se puede enviar solo una parte de los campos)
export const updateServiceSchema = z
  .object(serviceFields, withMessage(BODY_MESSAGE))
  .partial()
  .refine(
    atLeastOneField,
    atLeastOne("Debe enviar al menos un campo para actualizar"),
  );

// GET /api/services (y GET /views/services)
export const SERVICE_SORT_FIELDS = ["name", "price", "duration", "category"];

export const serviceQuerySchema = z.object({
  category: requiredString("category").optional(),
  available: z
    .enum(["true", "false"], enumMessage("available debe ser 'true' o 'false'"))
    .transform((value) => value === "true")
    .optional(),
  page: z.coerce
    .number(withMessage("page debe ser un número entero mayor o igual a 1"))
    .int("page debe ser un número entero")
    .min(1, "page debe ser mayor o igual a 1")
    .default(1),
  limit: z.coerce
    .number(withMessage("limit debe ser un número entero entre 1 y 100"))
    .int("limit debe ser un número entero")
    .min(1, "limit debe ser mayor o igual a 1")
    .max(100, "limit no puede ser mayor a 100")
    .default(10),
  sortBy: z
    .enum(
      SERVICE_SORT_FIELDS,
      enumMessage(`sortBy debe ser uno de: ${SERVICE_SORT_FIELDS.join(", ")}`),
    )
    .optional(),
  order: z
    .enum(["asc", "desc"], enumMessage("order debe ser 'asc' o 'desc'"))
    .default("asc"),
});
