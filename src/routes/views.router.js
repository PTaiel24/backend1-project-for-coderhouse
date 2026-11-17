import { Router } from "express";
import ViewsController from "../controllers/views.controller.js";
import ServicesService from "../services/services.service.js";
import ServicesRepository from "../repositories/services.repository.js";
import ServicesMongoDAO from "../dao/services.mongo.dao.js";

import BookingsService from "../services/bookings.service.js";
import BookingsRepository from "../repositories/bookings.repository.js";
import BookingsMongoDAO from "../dao/bookings.mongo.dao.js";

import MessagesService from "../services/messages.service.js";
import MessagesRepository from "../repositories/messages.repository.js";
import MessagesMongoDAO from "../dao/messages.mongo.dao.js";

const dao = new ServicesMongoDAO();
const repository = new ServicesRepository(dao);
const services = new ServicesService(repository);

const bookingsDao = new BookingsMongoDAO();
const bookingsRepository = new BookingsRepository(bookingsDao);
const bookings = new BookingsService(bookingsRepository, services);

const messagesDao = new MessagesMongoDAO();
const messagesRepository = new MessagesRepository(messagesDao);
const messages = new MessagesService(messagesRepository);

const controller = new ViewsController(services, bookings, messages);

const router = Router();

router.get("/services", async (req, res) => controller.getServices(req, res));
router.get("/services/:id", async (req, res) =>
  controller.getServiceById(req, res),
);
router.get("/create-service", async (req, res) =>
  controller.createService(req, res),
);
router.get("/edit-service/:id", async (req, res) =>
  controller.updateService(req, res),
);

router.get("/bookings", async (req, res) => controller.getBookings(req, res));

router.get("/messages", async (req, res) => controller.getMessages(req, res));

export default router;
