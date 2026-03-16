'use strict';

const Project = require('./Project');

const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const VALID_STATUSES   = ['todo', 'in_progress', 'review', 'done'];

/** Task наследует Project — демонстрация наследования и полиморфизма (ПЗ_13) */
class Task extends Project {
  #priority;
  #status;
  #assignee;
  #deadline;
  #storyPoints;

  constructor(data) {
    super(data.title, data.description);
    this.id           = Project.generateId('TASK');
    this.#priority    = data.priority    || 'medium';
    this.#status      = data.status      || 'todo';
    this.#assignee    = data.assignee    || null;
    this.#deadline    = data.deadline    ? new Date(data.deadline) : null;
    this.#storyPoints = typeof data.storyPoints === 'number' ? data.storyPoints : 0;
    this.comments     = [];
    this.updatedAt    = new Date();
  }

  getPriority()    { return this.#priority; }
  getStatus()      { return this.#status; }
  getAssignee()    { return this.#assignee; }
  getDeadline()    { return this.#deadline; }
  getStoryPoints() { return this.#storyPoints; }

  setPriority(val) {
    if (!VALID_PRIORITIES.includes(val)) {
      throw new Error(`Недопустимый приоритет: ${val}`);
    }
    this.#priority = val;
    this._touch();
  }

  setStatus(val) {
    if (!VALID_STATUSES.includes(val)) {
      throw new Error(`Недопустимый статус: ${val}`);
    }
    this.#status = val;
    this._touch();
  }

  setAssignee(val)    { this.#assignee = val || null; this._touch(); }
  setDeadline(val)    { this.#deadline = val ? new Date(val) : null; this._touch(); }

  setStoryPoints(val) {
    if (typeof val !== 'number' || val < 0) {
      throw new Error('Story Points должны быть неотрицательным числом');
    }
    this.#storyPoints = val;
    this._touch();
  }

  update(updates) {
    const map = {
      title:       (v) => this.setTitle(v),
      description: (v) => this.setDescription(v),
      priority:    (v) => this.setPriority(v),
      status:      (v) => this.setStatus(v),
      assignee:    (v) => this.setAssignee(v),
      deadline:    (v) => this.setDeadline(v),
      storyPoints: (v) => this.setStoryPoints(v)
    };
    Object.keys(updates).forEach((k) => { if (map[k]) { map[k](updates[k]); } });
    return this;
  }

  addComment(userId, text) {
    if (!userId) { throw new Error('userId обязателен'); }
    if (!text || text.trim().length === 0) {
      throw new Error('Текст комментария пустой');
    }
    const comment = {
      id: Project.generateId('CMT'),
      userId,
      text: text.trim(),
      createdAt: new Date()
    };
    this.comments.push(comment);
    this._touch();
    return comment;
  }

  isDeadlineApproaching(hoursThreshold = 24) {
    if (!this.#deadline) { return false; }
    const diffHours = (this.#deadline - Date.now()) / 3600000;
    return diffHours > 0 && diffHours <= hoursThreshold;
  }

  validate() {
    const errors = [];
    if (!this.getTitle() || this.getTitle().length === 0) {
      errors.push('Название задачи обязательно');
    }
    if (this.getTitle().length > 200) {
      errors.push('Название не должно превышать 200 символов');
    }
    if (!VALID_PRIORITIES.includes(this.#priority)) {
      errors.push(`Приоритет должен быть одним из: ${VALID_PRIORITIES.join(', ')}`);
    }
    if (!VALID_STATUSES.includes(this.#status)) {
      errors.push(`Статус должен быть одним из: ${VALID_STATUSES.join(', ')}`);
    }
    if (typeof this.#storyPoints !== 'number' || this.#storyPoints < 0) {
      errors.push('Story Points — неотрицательное число');
    }
    return { valid: errors.length === 0, errors };
  }

  /** Полиморфизм — переопределяет Project.getInfo() (ПЗ_13) */
  getInfo() {
    return `[Task] ${this.getTitle()} | ${this.#status} | ${this.#priority} | SP: ${this.#storyPoints}`;
  }

  toJSON() {
    return {
      id:          this.id,
      title:       this.getTitle(),
      description: this.getDescription(),
      priority:    this.#priority,
      status:      this.#status,
      assignee:    this.#assignee,
      deadline:    this.#deadline,
      storyPoints: this.#storyPoints,
      comments:    this.comments.length,
      createdAt:   this.getCreatedAt(),
      updatedAt:   this.updatedAt
    };
  }

  _touch() { this.updatedAt = new Date(); }
}

module.exports = { Task, VALID_PRIORITIES, VALID_STATUSES };
