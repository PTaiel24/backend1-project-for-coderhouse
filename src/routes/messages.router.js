import { Router } from "express";
import MessagesController from "../controllers/messages.controller.js";
import MessagesService from "../services/messages.service.js";
import MessagesRepository from "../repositories/messages.repository.js";
import MessagesMongoDAO from "../dao/messages.mongo.dao.js";

const dao = new MessagesMongoDAO();
const repository = new MessagesRepository(dao);
const messages = new MessagesService(repository);
const messagesController = new MessagesController(messages);

const router = Router();

router.get("/", messagesController.getMessages);

router.get("/:mid", messagesController.getMessageById);

router.post("/", messagesController.createMessage);

router.put("/:mid", messagesController.updateMessage);

router.delete("/:mid", messagesController.deleteMessage);

export default router;
