'use strict';

const { Task } = require('../models/Task');

class TaskFactory {
  static create(type, data) {
    switch (type) {
    case 'simple':
      return new Task({ ...data, priority: 'low',    storyPoints: data.storyPoints || 1 });
    case 'urgent':
      return new Task({ ...data, priority: 'urgent', storyPoints: data.storyPoints || 8 });
    case 'subtask':
      return new Task({ ...data, priority: data.priority || 'medium', storyPoints: data.storyPoints || 2 });
    default:
      return new Task(data);
    }
  }
}

module.exports = TaskFactory;
