import { Router } from "express";
import ServicesController from "../controllers/services.controller.js";
import ServicesService from "../services/services.service.js";
import ServicesRepository from "../repositories/services.repository.js";
import ServicesMongoDAO from "../dao/services.mongo.dao.js";

const dao = new ServicesMongoDAO();
const repository = new ServicesRepository(dao);
const services = new ServicesService(repository);
const servicesController = new ServicesController(services);

const router = Router();

router.get("/", (req, res) => servicesController.getServices(req, res));

router.get("/:sid", (req, res) => servicesController.getServiceById(req, res));

router.post("/", (req, res) => servicesController.createService(req, res));

router.put("/:sid", (req, res) => servicesController.updateService(req, res));

router.delete("/:sid", (req, res) =>
  servicesController.deleteService(req, res),
);

export default router;
