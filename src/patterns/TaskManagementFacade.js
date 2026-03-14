'use strict';

const TaskService           = require('../services/TaskService');
const UserService           = require('../services/UserService');
const GoogleCalendarAdapter = require('./GoogleCalendarAdapter');
const Notification          = require('../models/Notification');
const storage               = require('../storage/InMemoryStorage');

class TaskManagementFacade {
  constructor() {
    this._taskService = TaskService;
    this._userService = UserService;
    this._calendar    = new GoogleCalendarAdapter();
  }

  createTaskWithSync(taskData, creatorId) {
    const result = this._taskService.createTask(taskData);
    if (!result.success) { return result; }

    const task = result.data;
    this._calendar.syncTask(task);

    if (task.getAssignee()) {
      storage.saveNotification(new Notification(
        task.id, task.getAssignee(),
        `Вам назначена задача: "${task.getTitle()}"`, 'assignment'
      ));
    }

    storage.saveNotification(new Notification(
      task.id, creatorId,
      `Задача "${task.getTitle()}" создана`, 'info'
    ));

    return { success: true, data: task };
  }

  changeStatus(taskId, newStatus, actorId) {
    const result = this._taskService.updateTask(taskId, { status: newStatus });
    if (!result.success) { return result; }

    if (newStatus === 'done') {
      storage.saveNotification(new Notification(
        taskId, actorId,
        `Задача завершена: "${result.data.getTitle()}"`, 'completion'
      ));
    }
    return result;
  }

  getUnreadNotifications(userId) {
    return storage.getNotificationsFor(userId).filter((n) => !n.isRead);
  }
}

module.exports = TaskManagementFacade;
