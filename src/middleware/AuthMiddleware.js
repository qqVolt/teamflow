'use strict';

const UserService = require('../services/UserService');

/**
 * Middleware авторизации — проверяет, что пользователь авторизован
 * и обладает необходимыми правами для выполнения операции.
 * Демонстрирует контроль доступа (ПЗ_26).
 */
function requireAuth(req, res, next) {
  if (!req.userId) {
    return res.status(401).json({ success: false, errors: ['Требуется авторизация'] });
  }
  const result = UserService.getUser(req.userId);
  if (!result.success) {
    return res.status(401).json({ success: false, errors: ['Пользователь не найден'] });
  }
  if (!result.data.isActive) {
    return res.status(403).json({ success: false, errors: ['Аккаунт деактивирован'] });
  }
  req.user = result.data;
  next();
}

/**
 * Middleware проверки прав — убеждается, что у пользователя есть конкретное право.
 * @param {string} permission — право, которое должно быть у пользователя
 */
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, errors: ['Требуется авторизация'] });
    }
    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        errors: [`Недостаточно прав: требуется право "${permission}"`]
      });
    }
    next();
  };
}

/**
 * Middleware проверки владельца задачи — пользователь может работать
 * только со своими задачами (ПЗ_26 User Story 2).
 * @param {Function} getTaskById — функция для получения задачи по ID
 */
function requireTaskOwner(getTaskById) {
  return (req, res, next) => {
    const taskId = req.params.taskId || req.params.id;
    if (!taskId) { return next(); }

    const result = getTaskById(taskId);
    if (!result.success) {
      return res.status(404).json({ success: false, errors: ['Задача не найдена'] });
    }
    const task = result.data;
    // admin и manager могут видеть все задачи
    if (req.user.hasPermission('manage_users') || req.user.hasPermission('delete')) {
      req.task = task;
      return next();
    }
    // разработчик видит только свои задачи
    if (task.getAssignee() !== req.user.id) {
      return res.status(403).json({
        success: false,
        errors: ['Доступ к задаче запрещён']
      });
    }
    req.task = task;
    next();
  };
}

module.exports = { requireAuth, requirePermission, requireTaskOwner };