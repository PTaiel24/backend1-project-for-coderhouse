import sendViewError from "../utils/sendViewError.js";

class ViewsController {
  constructor(services, bookings, messages) {
    this.services = services;
    this.bookings = bookings;
    this.messages = messages;

    this.getServices = this.getServices.bind(this);
    this.getBookings = this.getBookings.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.getServiceById = this.getServiceById.bind(this);
    this.createService = this.createService.bind(this);
    this.updateService = this.updateService.bind(this);
  }

  async getServices(req, res) {
    const { category, available } = req.query;
    try {
      const services = await this.services.getServices({
        category,
        available,
      });
      return res.status(200).render("services", {
        services,
      });
    } catch (error) {
      sendViewError(error, res);
    }
  }

  async getBookings(req, res) {
    try {
      const bookings = await this.bookings.getBookings();
      return res.status(200).render("bookings", { bookings });
    } catch (error) {
      sendViewError(error, res);
    }
  }

  async getMessages(req, res) {
    try {
      const messages = await this.messages.getMessages();
      return res.status(200).render("messages", { messages });
    } catch (error) {
      sendViewError(error, res);
    }
  }

  async getServiceById(req, res) {
    const { id } = req.params;
    try {
      const service = await this.services.getServiceById(id);
      return res.status(200).render("service-details", service);
    } catch (error) {
      sendViewError(error, res);
    }
  }

  async createService(req, res) {
    return res.status(200).render("create-service");
  }

  async updateService(req, res) {
    const { id } = req.params;
    try {
      const service = await this.services.getServiceById(id);
      return res.status(200).render("edit-service", service);
    } catch (error) {
      sendViewError(error, res);
    }
  }
}

export default ViewsController;
