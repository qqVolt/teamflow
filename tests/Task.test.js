'use strict';

const { Task, VALID_PRIORITIES, VALID_STATUSES } = require('../src/models/Task');
const Project = require('../src/models/Project');

describe('Task — модель задачи', () => {

  describe('Создание', () => {
    test('создаёт задачу с title', () => {
      const t = new Task({ title: 'Новая задача' });
      expect(t.getTitle()).toBe('Новая задача');
      expect(t.id).toMatch(/^TASK-/);
    });

    test('значения по умолчанию', () => {
      const t = new Task({ title: 'Задача' });
      expect(t.getPriority()).toBe('medium');
      expect(t.getStatus()).toBe('todo');
      expect(t.getStoryPoints()).toBe(0);
      expect(t.getAssignee()).toBeNull();
    });

    test('принимает все поля', () => {
      const deadline = new Date(Date.now() + 86400000);
      const t = new Task({ title: 'Полная', priority: 'high', status: 'in_progress',
                           assignee: 'USR-001', deadline, storyPoints: 8 });
      expect(t.getPriority()).toBe('high');
      expect(t.getStatus()).toBe('in_progress');
      expect(t.getStoryPoints()).toBe(8);
    });

    test('бросает ошибку на пустой title', () => {
      expect(() => new Task({ title: '' })).toThrow();
    });

    test('бросает ошибку на title из пробелов', () => {
      expect(() => new Task({ title: '   ' })).toThrow();
    });
  });

  describe('Наследование и полиморфизм (ПЗ_13)', () => {
    test('Task instanceof Project', () => {
      expect(new Task({ title: 'T' }) instanceof Project).toBe(true);
    });

    test('getInfo() переопределён', () => {
      const t = new Task({ title: 'T', status: 'done', priority: 'high', storyPoints: 5 });
      expect(t.getInfo()).toContain('[Task]');
      expect(t.getInfo()).toContain('done');
    });

    test('Project.getInfo() и Task.getInfo() различаются', () => {
      const p = new Project('P', '');
      const t = new Task({ title: 'T' });
      expect(p.getInfo()).toContain('[Project]');
      expect(t.getInfo()).toContain('[Task]');
    });
  });

  describe('Валидация', () => {
    test('validate() проходит для корректной задачи', () => {
      const r = new Task({ title: 'OK', priority: 'low', status: 'todo' }).validate();
      expect(r.valid).toBe(true);
    });

    test('setPriority бросает ошибку на недопустимое значение', () => {
      expect(() => new Task({ title: 'T' }).setPriority('critical')).toThrow('Недопустимый приоритет');
    });

    test('setStatus бросает ошибку на недопустимое значение', () => {
      expect(() => new Task({ title: 'T' }).setStatus('blocked')).toThrow('Недопустимый статус');
    });

    test('setStoryPoints бросает ошибку на отрицательное число', () => {
      expect(() => new Task({ title: 'T' }).setStoryPoints(-1)).toThrow('Story Points');
    });

    test('VALID_PRIORITIES содержит 4 значения', () => {
      expect(VALID_PRIORITIES).toEqual(['low', 'medium', 'high', 'urgent']);
    });

    test('VALID_STATUSES содержит Kanban-колонки', () => {
      expect(VALID_STATUSES).toEqual(['todo', 'in_progress', 'review', 'done']);
    });
  });

  describe('Обновление', () => {
    test('update() меняет поля', () => {
      const t = new Task({ title: 'Старая', priority: 'low', status: 'todo' });
      t.update({ title: 'Новая', priority: 'high', status: 'in_progress' });
      expect(t.getTitle()).toBe('Новая');
      expect(t.getPriority()).toBe('high');
      expect(t.getStatus()).toBe('in_progress');
    });
  });

  describe('Комментарии', () => {
    test('addComment() добавляет комментарий', () => {
      const t = new Task({ title: 'T' });
      const c = t.addComment('USR-1', 'Текст');
      expect(c.id).toMatch(/^CMT-/);
      expect(t.comments).toHaveLength(1);
    });

    test('addComment() бросает ошибку на пустой текст', () => {
      expect(() => new Task({ title: 'T' }).addComment('USR-1', '  ')).toThrow('пустой');
    });

    test('addComment() бросает ошибку без userId', () => {
      expect(() => new Task({ title: 'T' }).addComment('', 'текст')).toThrow('userId');
    });
  });

  describe('Дедлайны', () => {
    test('true при дедлайне через 12 ч', () => {
      const t = new Task({ title: 'T', deadline: new Date(Date.now() + 12 * 3600000) });
      expect(t.isDeadlineApproaching(24)).toBe(true);
    });

    test('false при дедлайне через 7 дней', () => {
      const t = new Task({ title: 'T', deadline: new Date(Date.now() + 7 * 86400000) });
      expect(t.isDeadlineApproaching(24)).toBe(false);
    });

    test('false без дедлайна', () => {
      expect(new Task({ title: 'T' }).isDeadlineApproaching()).toBe(false);
    });

    test('false для просроченного дедлайна', () => {
      const t = new Task({ title: 'T', deadline: new Date(Date.now() - 3600000) });
      expect(t.isDeadlineApproaching(24)).toBe(false);
    });
  });

  describe('toJSON()', () => {
    test('содержит все нужные поля', () => {
      const json = new Task({ title: 'J', storyPoints: 5 }).toJSON();
      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('title', 'J');
      expect(json).toHaveProperty('storyPoints', 5);
      expect(json).toHaveProperty('createdAt');
    });
  });
});
