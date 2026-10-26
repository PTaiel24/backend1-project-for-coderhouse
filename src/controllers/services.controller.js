import ServicesService from "../services/services.service.js";
import sendError from "../utils/sendError.js";

class ServicesController {
  constructor() {
    this.servicesService = new ServicesService();

    this.getServices = this.getServices.bind(this);
    this.getServiceById = this.getServiceById.bind(this);
    this.createService = this.createService.bind(this);
    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  async getServices(req, res) {
    try {
      const { category, available } = req.query;
      const services = await this.servicesService.getServices({
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
      const service = await this.servicesService.getServiceById(Number(sid));
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
      const newService = await this.servicesService.createService(req.body);
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
      const updateService = await this.servicesService.updateService(
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
      const deleteService = await this.servicesService.deleteService(
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
