'use strict';

const bcrypt   = require('bcrypt');
const Project  = require('./Project');

const VALID_ROLES = ['admin', 'manager', 'developer', 'viewer'];
const ROLE_PERMISSIONS = {
  admin:     ['create', 'read', 'update', 'delete', 'manage_users'],
  manager:   ['create', 'read', 'update', 'delete'],
  developer: ['create', 'read', 'update'],
  viewer:    ['read']
};

const SALT_ROUNDS = 10;

class User {
  #passwordHash;

  constructor(data) {
    this.id        = Project.generateId('USR');
    this.name      = data.name  ? data.name.trim()                : '';
    this.email     = data.email ? data.email.trim().toLowerCase() : '';
    this.role      = data.role  || 'developer';
    this.#passwordHash = data.passwordHash || null;
    if (data.password) {
      if (data.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
      }
      this.#passwordHash = bcrypt.hashSync(data.password, SALT_ROUNDS);
    }
    this.isActive  = true;
    this.createdAt = new Date();
  }

  hasPermission(permission) {
    const allowed = ROLE_PERMISSIONS[this.role];
    return Array.isArray(allowed) && allowed.includes(permission);
  }

  checkPassword(password) {
    return bcrypt.compareSync(password, this.#passwordHash || '');
  }

  validate() {
    const errors = [];
    if (!this.name  || this.name.length === 0)   { errors.push('Имя пользователя обязательно'); }
    if (!this.email || !this.email.includes('@')) { errors.push('Некорректный email'); }
    if (!this.#passwordHash) {
      errors.push('Пароль обязателен');
    }
    if (!VALID_ROLES.includes(this.role)) {
      errors.push(`Роль должна быть одной из: ${VALID_ROLES.join(', ')}`);
    }
    return { valid: errors.length === 0, errors };
  }

  toJSON() {
    return {
      id: this.id, name: this.name, email: this.email,
      role: this.role, isActive: this.isActive, createdAt: this.createdAt
    };
  }
}

module.exports = { User, VALID_ROLES, ROLE_PERMISSIONS };
