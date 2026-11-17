import { MessageModel } from "./models/message.model.js";

class MessagesMongoDAO {
  async getAll({ user } = {}) {
    const filters = {};

    if (user) {
      filters.user = user;
    }

    return MessageModel.find(filters).sort({ createdAt: 1 }).lean();
  }

  async getById(id) {
    return MessageModel.findById(id).lean();
  }

  async create(messageData) {
    return MessageModel.create(messageData);
  }

  async update(id, updateData) {
    return MessageModel.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    }).lean();
  }

  async delete(id) {
    return MessageModel.findByIdAndDelete(id).lean();
  }
}

export default MessagesMongoDAO;
