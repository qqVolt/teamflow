'use strict';

const TaskFactory = require('../patterns/TaskFactory');
const storage     = require('../storage/InMemoryStorage');

class TaskService {
  createTask(data, type = 'default') {
    try {
      if (!data || typeof data !== 'object') {
        return { success: false, errors: ['Данные задачи отсутствуют'] };
      }
      const task = TaskFactory.create(type, data);
      const validation = task.validate();
      if (!validation.valid) { return { success: false, errors: validation.errors }; }

      if (data.assignee) {
        const assignee = storage.getUser(data.assignee);
        if (!assignee) {
          return { success: false, errors: [`Исполнитель ${data.assignee} не найден`] };
        }
        if (!assignee.isActive) {
          return { success: false, errors: ['Нельзя назначить задачу деактивированному пользователю'] };
        }
      }

      storage.saveTask(task);
      console.log(`[TaskService] Создана задача: ${task.id} "${task.getTitle()}"`);
      return { success: true, data: task };
    } catch (err) {
      console.error('[TaskService] createTask:', err.message);
      return { success: false, errors: [err.message] };
    }
  }

  getTask(taskId) {
    try {
      const task = storage.getTask(taskId);
      if (!task) { return { success: false, errors: ['Задача не найдена'] }; }
      return { success: true, data: task };
    } catch (err) {
      console.error('[TaskService] getTask:', err.message);
      return { success: false, errors: [err.message] };
    }
  }

  getTasks(filters = {}) {
    try {
      const tasks = Object.keys(filters).length > 0
        ? storage.filterTasks(filters)
        : storage.getAllTasks();
      return { success: true, data: tasks, count: tasks.length };
    } catch (err) {
      console.error('[TaskService] getTasks:', err.message);
      return { success: false, errors: [err.message] };
    }
  }

  updateTask(taskId, updates) {
    try {
      const task = storage.getTask(taskId);
      if (!task) { return { success: false, errors: ['Задача не найдена'] }; }
      task.update(updates);
      const validation = task.validate();
      if (!validation.valid) { return { success: false, errors: validation.errors }; }
      storage.saveTask(task);
      return { success: true, data: task };
    } catch (err) {
      console.error('[TaskService] updateTask:', err.message);
      return { success: false, errors: [err.message] };
    }
  }

  deleteTask(taskId) {
    try {
      if (!storage.getTask(taskId)) { return { success: false, errors: ['Задача не найдена'] }; }
      storage.deleteTask(taskId);
      return { success: true };
    } catch (err) {
      console.error('[TaskService] deleteTask:', err.message);
      return { success: false, errors: [err.message] };
    }
  }

  addComment(taskId, userId, text) {
    try {
      const task = storage.getTask(taskId);
      if (!task) { return { success: false, errors: ['Задача не найдена'] }; }
      const user = storage.getUser(userId);
      if (!user) { return { success: false, errors: ['Пользователь не найден'] }; }
      if (!text || text.trim().length === 0) {
        return { success: false, errors: ['Комментарий не может быть пустым'] };
      }
      const comment = task.addComment(userId, text);
      storage.saveTask(task);
      return { success: true, data: comment };
    } catch (err) {
      console.error('[TaskService] addComment:', err.message);
      return { success: false, errors: [err.message] };
    }
  }

  getApproachingDeadlines(hoursThreshold = 24) {
    try {
      const tasks = storage.getAllTasks().filter((t) => t.isDeadlineApproaching(hoursThreshold));
      return { success: true, data: tasks, count: tasks.length };
    } catch (err) {
      console.error('[TaskService] getApproachingDeadlines:', err.message);
      return { success: false, errors: [err.message] };
    }
  }
}

module.exports = new TaskService();
