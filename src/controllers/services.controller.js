import sendError from "../utils/sendError.js";
import emitEvent from "../utils/emitEvent.js";
import buildPageLink from "../utils/buildPageLink.js";

class ServicesController {
  constructor(services) {
    this.services = services;

    this.getServices = this.getServices.bind(this);
    this.getServiceById = this.getServiceById.bind(this);
    this.createService = this.createService.bind(this);
    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  async getServices(req, res) {
    try {
      const query = req.validatedQuery;
      const { services, pagination } = await this.services.getServices(query);
      return res.status(200).json({
        status: "success",
        payload: services,
        ...pagination,
        prevLink: buildPageLink("/api/services", query, pagination.prevPage),
        nextLink: buildPageLink("/api/services", query, pagination.nextPage),
      });
    } catch (error) {
      sendError(error, res);
    }
  }

  async getServiceById(req, res) {
    try {
      const { sid } = req.params;
      const service = await this.services.getServiceById(sid);
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
      const newService = await this.services.createService(req.body);

      emitEvent(req, "serviceCreated", newService);

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
      const updateService = await this.services.updateService(sid, req.body);

      emitEvent(req, "serviceUpdated", updateService);

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
      const deleteService = await this.services.deleteService(sid);

      emitEvent(req, "serviceDeleted", sid);

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
