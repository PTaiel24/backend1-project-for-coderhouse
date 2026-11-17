import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import MessagesService from "../src/services/messages.service.js";

// Repositorio en memoria: gracias a la inyección por constructor,
// el service se prueba sin MongoDB.
const createFakeRepository = () => {
  const items = [];

  return {
    async getAll({ user } = {}) {
      return user ? items.filter((item) => item.user === user) : [...items];
    },
    async getById(id) {
      return items.find((item) => item._id === id) || null;
    },
    async create(data) {
      const created = { _id: new mongoose.Types.ObjectId().toString(), ...data };
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

const newId = () => new mongoose.Types.ObjectId().toString();

describe("MessagesService", () => {
  let service;

  beforeEach(() => {
    service = new MessagesService(createFakeRepository());
  });

  it("crea un mensaje y le recorta los espacios", async () => {
    const created = await service.createMessage({
      user: " Taiel ",
      message: " Hola ",
    });

    assert.equal(created.user, "Taiel");
    assert.equal(created.message, "Hola");
  });

  it("rechaza mensajes inválidos con status 400", async () => {
    const invalidBodies = [
      null,
      [],
      {},
      { user: "Taiel" },
      { message: "Hola" },
      { user: 1, message: "Hola" },
      { user: "Taiel", message: "a".repeat(501) },
    ];

    for (const body of invalidBodies) {
      await assert.rejects(service.createMessage(body), { statusCode: 400 });
    }
  });

  it("filtra por usuario y valida el tipo del filtro", async () => {
    await service.createMessage({ user: "Ana", message: "uno" });
    await service.createMessage({ user: "Beto", message: "dos" });

    const result = await service.getMessages({ user: "Ana" });

    assert.equal(result.length, 1);
    await assert.rejects(service.getMessages({ user: ["Ana", "Beto"] }), {
      statusCode: 400,
    });
  });

  it("devuelve 400 con id inválido y 404 si no existe", async () => {
    await assert.rejects(service.getMessageById("abc"), { statusCode: 400 });
    await assert.rejects(service.getMessageById(newId()), { statusCode: 404 });
  });

  it("actualiza parcialmente y exige al menos un campo válido", async () => {
    const created = await service.createMessage({
      user: "Ana",
      message: "uno",
    });

    const updated = await service.updateMessage(created._id, {
      message: " editado ",
    });

    assert.equal(updated.message, "editado");
    assert.equal(updated.user, "Ana");
    await assert.rejects(service.updateMessage(created._id, {}), {
      statusCode: 400,
    });
    await assert.rejects(service.updateMessage(newId(), { message: "x" }), {
      statusCode: 404,
    });
  });

  it("elimina un mensaje y responde 404 si ya no existe", async () => {
    const created = await service.createMessage({
      user: "Ana",
      message: "uno",
    });

    await service.deleteMessage(created._id);

    await assert.rejects(service.deleteMessage(created._id), {
      statusCode: 404,
    });
  });
});
