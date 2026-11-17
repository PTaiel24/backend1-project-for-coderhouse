import sendError from "../utils/sendError.js";
import emitEvent from "../utils/emitEvent.js";

class MessagesController {
  constructor(messages) {
    this.messages = messages;

    this.getMessages = this.getMessages.bind(this);
    this.getMessageById = this.getMessageById.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  async getMessages(req, res) {
    try {
      const { user } = req.query;
      const messages = await this.messages.getMessages({ user });
      return res.status(200).json({
        status: "success",
        payload: messages,
      });
    } catch (error) {
      sendError(error, res);
    }
  }

  async getMessageById(req, res) {
    try {
      const { mid } = req.params;
      const message = await this.messages.getMessageById(mid);
      return res.status(200).json({
        status: "success",
        payload: message,
      });
    } catch (error) {
      sendError(error, res);
    }
  }

  async createMessage(req, res) {
    try {
      const newMessage = await this.messages.createMessage(req.body);

      emitEvent(req, "messageCreated", newMessage);

      return res.status(201).json({
        status: "success",
        payload: newMessage,
      });
    } catch (error) {
      sendError(error, res);
    }
  }

  async updateMessage(req, res) {
    try {
      const { mid } = req.params;
      const updatedMessage = await this.messages.updateMessage(mid, req.body);

      emitEvent(req, "messageUpdated", updatedMessage);

      res.status(200).json({
        status: "success",
        payload: updatedMessage,
      });
    } catch (error) {
      sendError(error, res);
    }
  }

  async deleteMessage(req, res) {
    try {
      const { mid } = req.params;
      const deletedMessage = await this.messages.deleteMessage(mid);

      emitEvent(req, "messageDeleted", mid);

      res.status(200).json({
        status: "success",
        payload: deletedMessage,
      });
    } catch (error) {
      sendError(error, res);
    }
  }
}

export default MessagesController;
