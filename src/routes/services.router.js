import { Router } from "express";
import { ServiceManager } from "../managers/ServiceManager.js";

const serviceManager = new ServiceManager();
const router = Router();

const sendError = (error, res) => {
  res.status(error.statusCode || 500).json({
    status: "error",
    message: error.message,
  });
};

router.get("/", async (req, res) => {
  try {
    const { category, available } = req.query;
    const services = await serviceManager.getServices({ category, available });
    return res.status(200).json({
      status: "success",
      payload: services,
    });
  } catch (error) {
    sendError(error, res);
  }
});

router.get("/:sid", async (req, res) => {
  try {
    const { sid } = req.params;
    const service = await serviceManager.getServiceById(Number(sid));
    return res.status(200).json({
      status: "success",
      payload: service,
    });
  } catch (error) {
    sendError(error, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const newService = await serviceManager.addService(req.body);
    return res.status(201).json({
      status: "success",
      payload: newService,
    });
  } catch (error) {
    sendError(error, res);
  }
});

router.put("/:sid", async (req, res) => {
  try {
    const { sid } = req.params;
    const updateService = await serviceManager.updateService(
      Number(sid),
      req.body,
    );
    res.status(200).json({
      status: "success",
      payload: updateService,
    });
  } catch (error) {
    sendError(error, res);
  }
});

router.delete("/:sid", async (req, res) => {
  try {
    const { sid } = req.params;
    const deleteService = await serviceManager.deleteService(Number(sid));
    res.status(200).json({
      status: "success",
      payload: deleteService,
    });
  } catch (error) {
    sendError(error, res);
  }
});

export default router;
