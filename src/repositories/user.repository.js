import UserDAO from '../dao/mongo/user.dao.js';

const userDAO = new UserDAO();

export default class UserRepository {
  async getUserById(id) {
    return await userDAO.getById(id);
  }

  async getUserByEmail(email) {
    return await userDAO.getByEmail(email);
  }

  async createUser(data) {
    return await userDAO.create(data);
  }

  async changePassword(id, newPassword) {
    return await userDAO.updatePassword(id, newPassword);
  }
}
