'use strict';

const Project = require('./Project');

class Notification {
  constructor(taskId, userId, message, type = 'info') {
    this.id        = Project.generateId('NOTIF');
    this.taskId    = taskId;
    this.userId    = userId;
    this.message   = message;
    this.type      = type;
    this.isRead    = false;
    this.createdAt = new Date();
  }

  markAsRead() { this.isRead = true; }

  toJSON() {
    return {
      id: this.id, taskId: this.taskId, userId: this.userId,
      message: this.message, type: this.type,
      isRead: this.isRead, createdAt: this.createdAt
    };
  }
}

module.exports = Notification;
