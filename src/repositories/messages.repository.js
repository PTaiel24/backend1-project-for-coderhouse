class MessagesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll({ user } = {}) {
    return this.dao.getAll({ user });
  }

  async getById(id) {
    return this.dao.getById(id);
  }

  async create(messageData) {
    return this.dao.create(messageData);
  }

  async update(id, updateData) {
    return this.dao.update(id, updateData);
  }

  async delete(id) {
    return this.dao.delete(id);
  }
}

export default MessagesRepository;
