'use strict';

class DatabaseConnection {
  constructor() {
    if (DatabaseConnection._instance) { return DatabaseConnection._instance; }
    this._connected = false;
    this._storage   = require('../storage/InMemoryStorage');
    DatabaseConnection._instance = this;
  }

  connect() {
    if (!this._connected) {
      console.log('[DB] Подключение к хранилищу...');
      this._connected = true;
    }
    return this._connected;
  }

  disconnect() {
    console.log('[DB] Отключение от хранилища.');
    this._connected = false;
  }

  isConnected() { return this._connected; }

  getStorage() {
    if (!this._connected) {
      throw new Error('Нет подключения. Вызовите connect() сначала.');
    }
    return this._storage;
  }
}

DatabaseConnection._instance = null;
module.exports = new DatabaseConnection();
