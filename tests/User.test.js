'use strict';

const { User, VALID_ROLES } = require('../src/models/User');

describe('User — модель пользователя', () => {

  describe('Создание', () => {
    test('создаёт пользователя', () => {
      const u = new User({ name: 'Иван', email: 'ivan@t.ru', password: 'pass123', role: 'developer' });
      expect(u.name).toBe('Иван');
      expect(u.id).toMatch(/^USR-/);
      expect(u.isActive).toBe(true);
    });

    test('email → нижний регистр', () => {
      const u = new User({ name: 'A', email: 'TEST@T.RU', password: 'pass123' });
      expect(u.email).toBe('test@t.ru');
    });
  });

  describe('Валидация', () => {
    test('корректный пользователь', () => {
      const u = new User({ name: 'A', email: 'a@b.ru', password: 'pass123', role: 'admin' });
      expect(u.validate().valid).toBe(true);
    });

    test('ошибка: пустое имя', () => {
      const r = new User({ name: '', email: 'a@b.ru', password: 'pass123' }).validate();
      expect(r.valid).toBe(false);
      expect(r.errors.some((e) => e.includes('Имя'))).toBe(true);
    });

    test('ошибка: некорректный email', () => {
      const r = new User({ name: 'A', email: 'bad', password: 'pass123' }).validate();
      expect(r.valid).toBe(false);
    });

    test('ошибка: пароль < 6 символов', () => {
      const r = new User({ name: 'A', email: 'a@b.ru', password: '123' }).validate();
      expect(r.valid).toBe(false);
      expect(r.errors.some((e) => e.includes('Пароль'))).toBe(true);
    });
  });

  describe('Права доступа (PI-7)', () => {
    test('admin имеет все права', () => {
      const a = new User({ name: 'A', email: 'a@b.ru', password: 'aaa111', role: 'admin' });
      expect(a.hasPermission('manage_users')).toBe(true);
      expect(a.hasPermission('delete')).toBe(true);
    });

    test('viewer — только read', () => {
      const v = new User({ name: 'V', email: 'v@b.ru', password: 'vvv111', role: 'viewer' });
      expect(v.hasPermission('read')).toBe(true);
      expect(v.hasPermission('create')).toBe(false);
    });
  });

  describe('Пароль', () => {
    test('checkPassword → true', () => {
      const u = new User({ name: 'A', email: 'a@b.ru', password: 'correct' });
      expect(u.checkPassword('correct')).toBe(true);
    });

    test('checkPassword → false', () => {
      const u = new User({ name: 'A', email: 'a@b.ru', password: 'correct' });
      expect(u.checkPassword('wrong')).toBe(false);
    });

    test('toJSON() не содержит пароль', () => {
      const json = new User({ name: 'A', email: 'a@b.ru', password: 'secret' }).toJSON();
      expect(json).not.toHaveProperty('password');
    });
  });

  test('VALID_ROLES содержит 4 значения', () => {
    expect(VALID_ROLES).toHaveLength(4);
  });
});
