import { describe, it } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import ServicesService from "../src/services/services.service.js";

const newId = () => new mongoose.Types.ObjectId().toString();

// Repositorio simulado: devuelve una página de 3 documentos sobre un total dado.
const createFakeRepository = (total) => {
  const calls = [];

  return {
    calls,
    async getAll(options) {
      calls.push(options);
      return { docs: [{ name: "a" }, { name: "b" }, { name: "c" }], total };
    },
    async getById(id) {
      return id === "exists" ? { _id: id } : null;
    },
    async update() {
      return null;
    },
    async delete() {
      return null;
    },
  };
};

describe("ServicesService", () => {
  it("calcula los metadatos de paginación de la primera página", async () => {
    const service = new ServicesService(createFakeRepository(25));

    const { services, pagination } = await service.getServices({
      page: 1,
      limit: 10,
    });

    assert.equal(services.length, 3);
    assert.deepEqual(pagination, {
      total: 25,
      page: 1,
      limit: 10,
      totalPages: 3,
      prevPage: null,
      nextPage: 2,
      hasPrevPage: false,
      hasNextPage: true,
    });
  });

  it("calcula los metadatos de una página intermedia y de la última", async () => {
    const service = new ServicesService(createFakeRepository(25));

    const middle = await service.getServices({ page: 2, limit: 10 });
    const last = await service.getServices({ page: 3, limit: 10 });

    assert.equal(middle.pagination.prevPage, 1);
    assert.equal(middle.pagination.nextPage, 3);
    assert.equal(last.pagination.hasNextPage, false);
    assert.equal(last.pagination.nextPage, null);
    assert.equal(last.pagination.hasPrevPage, true);
  });

  it("con cero resultados devuelve una sola página vacía", async () => {
    const service = new ServicesService(createFakeRepository(0));

    const { pagination } = await service.getServices({ page: 1, limit: 10 });

    assert.equal(pagination.totalPages, 1);
    assert.equal(pagination.hasNextPage, false);
    assert.equal(pagination.hasPrevPage, false);
  });

  it("le pasa al repository los filtros y el ordenamiento", async () => {
    const repository = createFakeRepository(5);
    const service = new ServicesService(repository);
    const options = {
      category: "salud",
      available: true,
      page: 1,
      limit: 5,
      sortBy: "price",
      order: "desc",
    };

    await service.getServices(options);

    assert.deepEqual(repository.calls[0], options);
  });

  it("devuelve 400 con id inválido y 404 si el servicio no existe", async () => {
    const service = new ServicesService(createFakeRepository(0));

    await assert.rejects(service.getServiceById("abc"), { statusCode: 400 });
    await assert.rejects(service.getServiceById(newId()), { statusCode: 404 });
    await assert.rejects(service.updateService(newId(), { price: 1 }), {
      statusCode: 404,
    });
    await assert.rejects(service.deleteService(newId()), { statusCode: 404 });
  });
});
