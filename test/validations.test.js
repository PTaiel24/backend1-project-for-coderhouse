import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createServiceSchema,
  updateServiceSchema,
  serviceQuerySchema,
} from "../src/validations/service.validation.js";
import {
  createBookingSchema,
  updateBookingSchema,
  addServiceToBookingParamsSchema,
} from "../src/validations/booking.validation.js";
import {
  validateBody,
  validateQuery,
} from "../src/middlewares/validate.middleware.js";

const validService = {
  name: "Corte de cabello",
  description: "Corte personalizado",
  duration: 45,
  price: 8500,
  category: "Barberia",
  available: true,
};

const validBooking = {
  clientName: "Juan Pérez",
  clientEmail: "juan@example.com",
  date: "2026-12-15",
  time: "14:30",
};

const isValid = (schema, data) => schema.safeParse(data).success;

describe("Validación de servicios", () => {
  it("acepta un servicio válido (available es opcional)", () => {
    assert.equal(isValid(createServiceSchema, validService), true);

    const { available, ...withoutAvailable } = validService;
    assert.equal(isValid(createServiceSchema, withoutAvailable), true);
  });

  it("rechaza servicios con datos incorrectos", () => {
    const invalid = [
      undefined,
      null,
      [],
      {},
      { ...validService, name: "   " },
      { ...validService, price: "8500" },
      { ...validService, price: -1 },
      { ...validService, duration: 0 },
      { ...validService, available: "si" },
    ];

    invalid.forEach((data) => {
      assert.equal(isValid(createServiceSchema, data), false);
    });
  });

  it("al actualizar acepta campos sueltos y exige al menos uno", () => {
    assert.equal(isValid(updateServiceSchema, { price: 100 }), true);
    assert.equal(isValid(updateServiceSchema, {}), false);
    assert.equal(isValid(updateServiceSchema, { price: -5 }), false);
  });
});

describe("Validación de los query params de servicios", () => {
  it("aplica valores por defecto cuando no se envía nada", () => {
    const result = serviceQuerySchema.parse({});

    assert.equal(result.page, 1);
    assert.equal(result.limit, 10);
    assert.equal(result.order, "asc");
    assert.equal(result.sortBy, undefined);
  });

  it("convierte los textos de la URL en los tipos correctos", () => {
    const result = serviceQuerySchema.parse({
      category: "salud",
      available: "true",
      page: "2",
      limit: "5",
      sortBy: "price",
      order: "desc",
    });

    assert.deepEqual(result, {
      category: "salud",
      available: true,
      page: 2,
      limit: 5,
      sortBy: "price",
      order: "desc",
    });
  });

  it("rechaza valores fuera de rango o no permitidos", () => {
    const invalid = [
      { page: "0" },
      { page: "abc" },
      { limit: "0" },
      { limit: "101" },
      { sortBy: "password" },
      { order: "up" },
      { available: "maybe" },
      { category: "" },
    ];

    invalid.forEach((query) => {
      assert.equal(isValid(serviceQuerySchema, query), false);
    });
  });
});

describe("Validación de reservas", () => {
  it("acepta una reserva válida", () => {
    assert.equal(isValid(createBookingSchema, validBooking), true);
  });

  it("rechaza reservas con datos incorrectos", () => {
    const invalid = [
      undefined,
      {},
      { ...validBooking, clientName: "" },
      { ...validBooking, clientEmail: "no-es-un-email" },
      { ...validBooking, date: "15/12/2026" },
      { ...validBooking, date: "2026-02-31" },
      { ...validBooking, date: ["2026-12-15"] },
      { ...validBooking, time: "25:00" },
      { ...validBooking, time: "9:5" },
    ];

    invalid.forEach((data) => {
      assert.equal(isValid(createBookingSchema, data), false);
    });
  });

  it("no deja pasar el estado ni los servicios enviados en el body", () => {
    const result = createBookingSchema.parse({
      ...validBooking,
      status: "hack",
      services: [{ service: "x", quantity: 99 }],
    });

    assert.equal(result.status, undefined);
    assert.equal(result.services, undefined);
  });

  it("al actualizar acepta campos sueltos y exige al menos uno válido", () => {
    assert.equal(isValid(updateBookingSchema, { time: "16:00" }), true);
    assert.equal(isValid(updateBookingSchema, { status: "confirmed" }), true);
    assert.equal(isValid(updateBookingSchema, {}), false);
    assert.equal(isValid(updateBookingSchema, { services: [] }), false);
    assert.equal(isValid(updateBookingSchema, { time: "99" }), false);
  });

  it("agregar servicio: valida el formato de los ids de la URL", () => {
    const id = "65f1a2b3c4d5e6f7a8b9c0d1";

    assert.equal(
      isValid(addServiceToBookingParamsSchema, { bid: id, sid: id }),
      true,
    );
    assert.equal(
      isValid(addServiceToBookingParamsSchema, { bid: "123", sid: id }),
      false,
    );
    assert.equal(
      isValid(addServiceToBookingParamsSchema, { bid: id, sid: "zzz" }),
      false,
    );
  });
});

describe("Middleware de validación", () => {
  it("con datos inválidos llama a next con un error 400 y no continúa", () => {
    const req = { body: { ...validService, price: -1 } };
    let receivedError;

    validateBody(createServiceSchema)(req, {}, (error) => {
      receivedError = error;
    });

    assert.equal(receivedError.statusCode, 400);
    assert.match(receivedError.message, /price/);
  });

  it("con datos válidos reemplaza el body por los datos limpios", () => {
    const req = { body: { ...validService, name: "  Corte  ", extra: 1 } };
    let receivedError = "sin llamar";

    validateBody(createServiceSchema)(req, {}, (error) => {
      receivedError = error;
    });

    assert.equal(receivedError, undefined);
    assert.equal(req.body.name, "Corte");
    assert.equal(req.body.extra, undefined);
  });

  it("para query params guarda el resultado en req.validatedQuery", () => {
    const req = { query: { page: "2", available: "false" } };

    validateQuery(serviceQuerySchema)(req, {}, () => {});

    assert.equal(req.validatedQuery.page, 2);
    assert.equal(req.validatedQuery.available, false);
    assert.equal(req.validatedQuery.limit, 10);
  });
});
