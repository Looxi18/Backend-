import User from '../../models/user.model.js';

export default class UserDAO {
  async getById(id) {
    return User.findById(id).populate('cart');
  }

  async getByEmail(email) {
    return User.findOne({ email });
  }

  async create(data) {
    const user = new User(data);
    return await user.save();
  }

  async updatePassword(userId, newHashedPassword) {
    return await User.findByIdAndUpdate(userId, { password: newHashedPassword });
  }
}
