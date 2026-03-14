'use strict';

const { User } = require('../models/User');
const storage  = require('../storage/InMemoryStorage');

class UserService {
  createUser(data) {
    try {
      if (!data || typeof data !== 'object') {
        return { success: false, errors: ['Данные пользователя отсутствуют'] };
      }
      if (data.email) {
        const existing = storage.findUserByEmail(data.email);
        if (existing) {
          return { success: false, errors: ['Пользователь с таким email уже существует'] };
        }
      }
      const user = new User(data);
      const validation = user.validate();
      if (!validation.valid) { return { success: false, errors: validation.errors }; }
      storage.saveUser(user);
      console.log(`[UserService] Зарегистрирован: ${user.id} <${user.email}>`);
      return { success: true, data: user };
    } catch (err) {
      console.error('[UserService] createUser:', err.message);
      return { success: false, errors: [err.message] };
    }
  }

  getUser(userId) {
    try {
      const user = storage.getUser(userId);
      if (!user) { return { success: false, errors: ['Пользователь не найден'] }; }
      return { success: true, data: user };
    } catch (err) {
      console.error('[UserService] getUser:', err.message);
      return { success: false, errors: [err.message] };
    }
  }

  getActiveUsers() {
    try {
      const users = storage.getAllUsers().filter((u) => u.isActive);
      return { success: true, data: users, count: users.length };
    } catch (err) {
      console.error('[UserService] getActiveUsers:', err.message);
      return { success: false, errors: [err.message] };
    }
  }

  deactivateUser(userId) {
    try {
      const user = storage.getUser(userId);
      if (!user) { return { success: false, errors: ['Пользователь не найден'] }; }
      user.isActive = false;
      storage.saveUser(user);
      return { success: true };
    } catch (err) {
      console.error('[UserService] deactivateUser:', err.message);
      return { success: false, errors: [err.message] };
    }
  }
}

module.exports = new UserService();
