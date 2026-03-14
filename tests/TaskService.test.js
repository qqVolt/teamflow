'use strict';

const TaskService = require('../src/services/TaskService');
const UserService = require('../src/services/UserService');
const storage     = require('../src/storage/InMemoryStorage');

beforeEach(() => { storage.clear(); });

describe('TaskService', () => {
  let user;
  beforeEach(() => { user = UserService.createUser({ name: 'T', email: 't@t.ru', password: 'Test123', role: 'developer' }).data; });

  describe('createTask()', () => {
    test('создаёт задачу', () => {
      const r = TaskService.createTask({ title: 'Задача', priority: 'high', status: 'todo' });
      expect(r.success).toBe(true);
      expect(r.data.getTitle()).toBe('Задача');
    });

    test('отказывает на пустой title', () => {
      expect(TaskService.createTask({ title: '' }).success).toBe(false);
    });

    test('отказывает на несуществующий assignee', () => {
      const r = TaskService.createTask({ title: 'T', assignee: 'USR-NONE' });
      expect(r.success).toBe(false);
      expect(r.errors[0]).toContain('не найден');
    });

    test('создаёт с существующим assignee', () => {
      const r = TaskService.createTask({ title: 'T', assignee: user.id });
      expect(r.success).toBe(true);
    });

    test('отказывает на null', () => {
      expect(TaskService.createTask(null).success).toBe(false);
    });
  });

  describe('getTask()', () => {
    test('возвращает задачу', () => {
      const id = TaskService.createTask({ title: 'T' }).data.id;
      expect(TaskService.getTask(id).success).toBe(true);
    });

    test('ошибка на несуществующий id', () => {
      expect(TaskService.getTask('TASK-0').success).toBe(false);
    });
  });

  describe('updateTask()', () => {
    test('обновляет статус', () => {
      const id = TaskService.createTask({ title: 'T' }).data.id;
      const r = TaskService.updateTask(id, { status: 'in_progress' });
      expect(r.success).toBe(true);
      expect(r.data.getStatus()).toBe('in_progress');
    });
  });

  describe('deleteTask()', () => {
    test('удаляет задачу', () => {
      const id = TaskService.createTask({ title: 'T' }).data.id;
      expect(TaskService.deleteTask(id).success).toBe(true);
      expect(TaskService.getTask(id).success).toBe(false);
    });
  });

  describe('addComment()', () => {
    test('добавляет комментарий', () => {
      const id = TaskService.createTask({ title: 'T' }).data.id;
      const r  = TaskService.addComment(id, user.id, 'OK!');
      expect(r.success).toBe(true);
      expect(r.data.text).toBe('OK!');
    });

    test('отказывает на пустой текст', () => {
      const id = TaskService.createTask({ title: 'T' }).data.id;
      expect(TaskService.addComment(id, user.id, '').success).toBe(false);
    });
  });

  describe('getTasks() — фильтрация', () => {
    test('фильтрует по статусу', () => {
      TaskService.createTask({ title: 'A', status: 'todo' });
      TaskService.createTask({ title: 'B', status: 'done' });
      expect(TaskService.getTasks({ status: 'todo' }).count).toBe(1);
    });

    test('возвращает все без фильтра', () => {
      TaskService.createTask({ title: 'A' });
      TaskService.createTask({ title: 'B' });
      expect(TaskService.getTasks().count).toBe(2);
    });
  });

  describe('getApproachingDeadlines()', () => {
    test('находит задачи с дедлайном в 24 ч', () => {
      TaskService.createTask({ title: 'Срочно',     deadline: new Date(Date.now() + 12 * 3600000) });
      TaskService.createTask({ title: 'Не срочно',  deadline: new Date(Date.now() + 48 * 3600000) });
      const r = TaskService.getApproachingDeadlines(24);
      expect(r.count).toBe(1);
      expect(r.data[0].getTitle()).toBe('Срочно');
    });
  });
});
