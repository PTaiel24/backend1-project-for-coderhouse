import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import BookingsService from "../src/services/bookings.service.js";

const newId = () => new mongoose.Types.ObjectId().toString();

const createFakeBookingsRepository = () => {
  const items = [];

  return {
    async getAll() {
      return [...items];
    },
    async getById(id) {
      return items.find((item) => item._id === id) || null;
    },
    async create(data) {
      const created = { _id: newId(), ...data };
      items.push(created);
      return created;
    },
    async update(id, data) {
      const found = items.find((item) => item._id === id);
      if (!found) return null;
      Object.assign(found, data);
      return found;
    },
    async delete(id) {
      const index = items.findIndex((item) => item._id === id);
      return index === -1 ? null : items.splice(index, 1)[0];
    },
  };
};

const validBooking = {
  clientName: "Juan Pérez",
  clientEmail: "juan@example.com",
  date: "2026-12-15",
  time: "14:30",
};

describe("BookingsService", () => {
  let service;
  let existingServiceId;

  beforeEach(() => {
    existingServiceId = newId();

    // Service de servicios simulado: solo necesita getServiceById.
    const fakeServices = {
      async getServiceById(id) {
        if (id !== existingServiceId) {
          const error = new Error("Servicio no encontrado");
          error.statusCode = 404;
          throw error;
        }
        return { _id: id, name: "Corte" };
      },
    };

    service = new BookingsService(createFakeBookingsRepository(), fakeServices);
  });

  it("crea una reserva con estado inicial y sin servicios", async () => {
    const created = await service.createBooking(validBooking);

    assert.equal(created.status, "success");
    assert.deepEqual(created.services, []);
  });

  it("rechaza reservas con datos inválidos (400)", async () => {
    const invalidBodies = [
      null,
      [],
      {},
      { ...validBooking, date: "2026-13-40" },
      { ...validBooking, date: ["2026-12-15"] },
      { ...validBooking, time: "25:00" },
    ];

    for (const body of invalidBodies) {
      await assert.rejects(service.createBooking(body), { statusCode: 400 });
    }
  });

  it("agrega un servicio y suma la cantidad si se repite", async () => {
    const booking = await service.createBooking(validBooking);

    await service.addServiceToBooking(booking._id, existingServiceId);
    const updated = await service.addServiceToBooking(
      booking._id,
      existingServiceId,
    );

    assert.equal(updated.services.length, 1);
    assert.equal(updated.services[0].quantity, 2);
  });

  it("addServiceToBooking responde 404 si falta la reserva o el servicio", async () => {
    const booking = await service.createBooking(validBooking);

    await assert.rejects(
      service.addServiceToBooking(newId(), existingServiceId),
      { statusCode: 404 },
    );
    await assert.rejects(service.addServiceToBooking(booking._id, newId()), {
      statusCode: 404,
    });
  });

  it("PUT: actualiza solo los campos permitidos", async () => {
    const booking = await service.createBooking(validBooking);

    const updated = await service.updateBooking(booking._id, {
      time: "16:00",
      status: "confirmed",
      services: [],
    });

    assert.equal(updated.time, "16:00");
    assert.equal(updated.status, "confirmed");
  });

  it("PUT: valida el cuerpo, el id y la existencia", async () => {
    const booking = await service.createBooking(validBooking);

    await assert.rejects(service.updateBooking(booking._id, {}), {
      statusCode: 400,
    });
    await assert.rejects(service.updateBooking(booking._id, { services: [] }), {
      statusCode: 400,
    });
    await assert.rejects(
      service.updateBooking(booking._id, { date: "2026-02-31" }),
      { statusCode: 400 },
    );
    await assert.rejects(
      service.updateBooking(booking._id, { clientName: "  " }),
      { statusCode: 400 },
    );
    await assert.rejects(service.updateBooking("abc", { time: "10:00" }), {
      statusCode: 400,
    });
    await assert.rejects(service.updateBooking(newId(), { time: "10:00" }), {
      statusCode: 404,
    });
  });

  it("DELETE: elimina la reserva, 404 si no existe y 400 con id inválido", async () => {
    const booking = await service.createBooking(validBooking);

    await service.deleteBooking(booking._id);

    await assert.rejects(service.deleteBooking(booking._id), {
      statusCode: 404,
    });
    await assert.rejects(service.deleteBooking("abc"), { statusCode: 400 });
  });
});
