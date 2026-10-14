import ServiceManager from "../managers/ServiceManager.js";
import sendError from "../utils/sendError.js";

class ServicesController {
  constructor() {
    this.serviceManager = new ServiceManager();

    this.getServices = this.getServices.bind(this);
    this.getServiceById = this.getServiceById.bind(this);
    this.createService = this.createService.bind(this);
    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  async getServices(req, res) {
    try {
      const { category, available } = req.query;
      const services = await this.serviceManager.getServices({
        category,
        available,
      });
      return res.status(200).json({
        status: "success",
        payload: services,
      });
    } catch (error) {
      sendError(error, res);
    }
  }

  async getServiceById(req, res) {
    try {
      const { sid } = req.params;
      const service = await this.serviceManager.getServiceById(Number(sid));
      return res.status(200).json({
        status: "success",
        payload: service,
      });
    } catch (error) {
      sendError(error, res);
    }
  }

  async createService(req, res) {
    try {
      const newService = await this.serviceManager.addService(req.body);
      return res.status(201).json({
        status: "success",
        payload: newService,
      });
    } catch (error) {
      sendError(error, res);
    }
  }

  async updateService(req, res) {
    try {
      const { sid } = req.params;
      const updateService = await this.serviceManager.updateService(
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
  }

  async deleteService(req, res) {
    try {
      const { sid } = req.params;
      const deleteService = await this.serviceManager.deleteService(
        Number(sid),
      );
      res.status(200).json({
        status: "success",
        payload: deleteService,
      });
    } catch (error) {
      sendError(error, res);
    }
  }
}

export default ServicesController;
