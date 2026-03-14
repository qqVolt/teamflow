'use strict';

class Project {
  #title;
  #description;
  #createdAt;

  constructor(title, description) {
    if (!title || title.trim().length === 0) {
      throw new Error('Название проекта обязательно');
    }
    this.id = Project.generateId('PROJ');
    this.#title = title.trim();
    this.#description = description ? description.trim() : '';
    this.#createdAt = new Date();
  }

  getTitle()       { return this.#title; }
  getDescription() { return this.#description; }
  getCreatedAt()   { return this.#createdAt; }

  setTitle(val) {
    if (!val || val.trim().length === 0) {
      throw new Error('Название не может быть пустым');
    }
    this.#title = val.trim();
  }

  setDescription(val) { this.#description = val ? val.trim() : ''; }

  /** Полиморфный метод — переопределяется в Task (PI-13) */
  getInfo() { return `[Project] ${this.#title}`; }

  static generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }
}

module.exports = Project;
