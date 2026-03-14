'use strict';

class InMemoryStorage {
  constructor() {
    if (InMemoryStorage._instance) { return InMemoryStorage._instance; }
    this._tasks         = new Map();
    this._users         = new Map();
    this._notifications = new Map();
    this._sprints       = new Map();
    InMemoryStorage._instance = this;
  }

  saveTask(task)   { this._tasks.set(task.id, task); return task; }
  getTask(id)      { return this._tasks.get(id) || null; }
  deleteTask(id)   { return this._tasks.delete(id); }
  getAllTasks()     { return Array.from(this._tasks.values()); }

  filterTasks(criteria = {}) {
    return this.getAllTasks().filter((t) => {
      if (criteria.status   && t.getStatus()   !== criteria.status)   { return false; }
      if (criteria.priority && t.getPriority() !== criteria.priority) { return false; }
      if (criteria.assignee && t.getAssignee() !== criteria.assignee) { return false; }
      return true;
    });
  }

  saveUser(user)         { this._users.set(user.id, user); return user; }
  getUser(id)            { return this._users.get(id) || null; }
  getAllUsers()           { return Array.from(this._users.values()); }
  findUserByEmail(email) {
    return this.getAllUsers().find((u) => u.email === email.toLowerCase()) || null;
  }

  saveNotification(n)         { this._notifications.set(n.id, n); return n; }
  getNotificationsFor(userId) {
    return Array.from(this._notifications.values()).filter((n) => n.userId === userId);
  }

  saveSprint(s)  { this._sprints.set(s.id, s); return s; }
  getSprint(id)  { return this._sprints.get(id) || null; }
  getAllSprints() { return Array.from(this._sprints.values()); }

  clear() {
    this._tasks.clear();
    this._users.clear();
    this._notifications.clear();
    this._sprints.clear();
  }
}

InMemoryStorage._instance = null;
module.exports = new InMemoryStorage();
