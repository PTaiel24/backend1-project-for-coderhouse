import createError from "../utils/createError.js";
import mongoose from "mongoose";

const MESSAGE_FIELDS = ["user", "message"];
const MAX_MESSAGE_LENGTH = 500;

const validateMessageData = (messageData, { partial = false } = {}) => {
  if (
    messageData === null ||
    typeof messageData !== "object" ||
    Array.isArray(messageData)
  ) {
    throw createError("El cuerpo de la solicitud debe ser un objeto JSON", 400);
  }

  const { user, message } = messageData;

  const errors = [];
  const shouldValidate = (field) => {
    return !partial || Object.hasOwn(messageData, field);
  };

  if (
    shouldValidate("user") &&
    (typeof user !== "string" || user.trim() === "")
  ) {
    errors.push("User debe de ser un string no vacio");
  }
  if (
    shouldValidate("message") &&
    (typeof message !== "string" || message.trim() === "")
  ) {
    errors.push("Message debe de ser un string no vacio");
  } else if (
    shouldValidate("message") &&
    message.trim().length > MAX_MESSAGE_LENGTH
  ) {
    errors.push(`Message no puede superar los ${MAX_MESSAGE_LENGTH} caracteres`);
  }

  if (errors.length > 0) {
    throw createError(errors.join(" - "), 400);
  }
};

const normalizeMessageData = (messageData) => {
  return Object.fromEntries(
    MESSAGE_FIELDS.filter((field) => Object.hasOwn(messageData, field)).map(
      (field) => [field, messageData[field].trim()],
    ),
  );
};

class MessagesService {
  constructor(repository) {
    this.repository = repository;
  }

  async getMessages(filters = {}) {
    const { user } = filters;

    if (user !== undefined && typeof user !== "string") {
      throw createError("El filtro user tiene que ser un texto", 400);
    }

    return this.repository.getAll(filters);
  }

  async getMessageById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError("Id no valido", 400);
    }

    const message = await this.repository.getById(id);

    if (!message) {
      throw createError("Mensaje no encontrado", 404);
    }
    return message;
  }

  async createMessage(messageData) {
    validateMessageData(messageData);

    return this.repository.create(normalizeMessageData(messageData));
  }

  async updateMessage(id, updateData) {
    if (
      !updateData ||
      typeof updateData !== "object" ||
      Array.isArray(updateData) ||
      !MESSAGE_FIELDS.some((field) => Object.hasOwn(updateData, field))
    ) {
      throw createError(
        "Debe enviar al menos un campo para actualizar (user o message)",
        400,
      );
    }

    validateMessageData(updateData, { partial: true });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError("Id no valido", 400);
    }

    const updatedMessage = await this.repository.update(
      id,
      normalizeMessageData(updateData),
    );

    if (!updatedMessage) {
      throw createError("Mensaje no encontrado", 404);
    }

    return updatedMessage;
  }

  async deleteMessage(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError("Id no valido", 400);
    }

    const deletedMessage = await this.repository.delete(id);

    if (!deletedMessage) {
      throw createError("Mensaje no encontrado", 404);
    }
    return deletedMessage;
  }
}

export default MessagesService;
