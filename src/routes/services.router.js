import { Router } from "express";
import ServicesController from "../controllers/services.controller.js";

const servicesController = new ServicesController();
const router = Router();

router.get("/", servicesController.getServices);

router.get("/:sid", servicesController.getServiceById);

router.post("/", servicesController.createService);

router.put("/:sid", servicesController.updateService);

router.delete("/:sid", servicesController.deleteService);

export default router;
