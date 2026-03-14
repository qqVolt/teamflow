'use strict';

const Project = require('./Project');

const VALID_ROLES = ['admin', 'manager', 'developer', 'viewer'];
const ROLE_PERMISSIONS = {
  admin:     ['create', 'read', 'update', 'delete', 'manage_users'],
  manager:   ['create', 'read', 'update', 'delete'],
  developer: ['create', 'read', 'update'],
  viewer:    ['read']
};

class User {
  #password;

  constructor(data) {
    this.id        = Project.generateId('USR');
    this.name      = data.name  ? data.name.trim()                : '';
    this.email     = data.email ? data.email.trim().toLowerCase() : '';
    this.role      = data.role  || 'developer';
    this.#password = data.password || '';
    this.isActive  = true;
    this.createdAt = new Date();
  }

  hasPermission(permission) {
    const allowed = ROLE_PERMISSIONS[this.role];
    return Array.isArray(allowed) && allowed.includes(permission);
  }

  checkPassword(password) { return this.#password === password; }

  validate() {
    const errors = [];
    if (!this.name  || this.name.length === 0)   { errors.push('Имя пользователя обязательно'); }
    if (!this.email || !this.email.includes('@')) { errors.push('Некорректный email'); }
    if (!this.#password || this.#password.length < 6) {
      errors.push('Пароль должен содержать минимум 6 символов');
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
