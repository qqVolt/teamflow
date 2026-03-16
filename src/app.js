'use strict';

const db                    = require('./patterns/DatabaseConnection');
const TaskService            = require('./services/TaskService');
const UserService            = require('./services/UserService');
const Sprint                 = require('./models/Sprint');
const TaskManagementFacade   = require('./patterns/TaskManagementFacade');
const Project                = require('./models/Project');
const storage                = require('./storage/InMemoryStorage');

const facade = new TaskManagementFacade();


console.log('  TeamFlow Task Manager v1.0.0');
console.log();

// Подключение (Singleton DatabaseConnection)
db.connect();
console.log(`  [DB] connected: ${db.isConnected()}`);
console.log();

// ── 1. Пользователи ────────────────────────────────────────────────────────
console.log('1. Создание пользователей');
const usersData = [
  { name: 'Иван Петров',    email: 'ivan@tf.ru',   password: 'Admin123', role: 'admin'     },
  { name: 'Ольга Сидорова', email: 'olga@tf.ru',   password: 'Mgr4567',  role: 'manager'   },
  { name: 'Дмитрий Козлов', email: 'dmitry@tf.ru', password: 'Dev7890',  role: 'developer' },
  { name: 'Мария Новикова', email: 'maria@tf.ru',  password: 'Dev1012',  role: 'developer' }
];
const users = [];
usersData.forEach((u) => {
  const r = UserService.createUser(u);
  if (r.success) { users.push(r.data); (`${r.data.name} (${r.data.role})`); }
});
const dupCheck = UserService.createUser(usersData[0]);
if (!dupCheck.success) { (`Дубликат отклонён: ${dupCheck.errors[0]}`); }
console.log();

// ── 2. Задачи через Facade (Factory + Calendar + Notification) ─────────────
console.log('2. Создание задач (TaskFactory + Facade) (ПЗ_11, ПЗ_12)');
const tasksData = [
  { title: 'Разработать REST API',    priority: 'high',   status: 'in_progress', assignee: users[2].id, storyPoints: 8,  deadline: new Date(Date.now() + 7 * 86400000) },
  { title: 'Создать Kanban-доску',    priority: 'medium', status: 'todo',        assignee: users[3].id, storyPoints: 13, deadline: new Date(Date.now() + 14 * 86400000) },
  { title: 'Система уведомлений',     priority: 'urgent', status: 'todo',        assignee: users[2].id, storyPoints: 5,  deadline: new Date(Date.now() + 2 * 3600000) },
  { title: 'Написать документацию API', priority: 'low', status: 'todo',        assignee: users[1].id, storyPoints: 3 }
];
const tasks = [];
tasksData.forEach((t) => {
  const r = facade.createTaskWithSync(t, users[0].id);
  if (r.success) { tasks.push(r.data);(`"${r.data.getTitle()}" SP:${r.data.getStoryPoints()}`); }
});
console.log();

// ── 3. Полиморфизм (ПЗ_13) ─────────────────────────────────────────────────
console.log('3. Полиморфизм — Task extends Project (ПЗ_13)');
const project = new Project('TeamFlow', 'Основной проект');
const items   = [project, ...tasks.slice(0, 3)];
console.log('  getInfo() на разнотипных объектах:');
items.forEach((item) => console.log(`    → ${item.getInfo()}`));
(`Task instanceof Project = ${tasks[0] instanceof Project}`);
console.log();

// ── 4. Kanban ──────────────────────────────────────────────────────────────
console.log('4. Kanban — состояние доски (ПЗ_23)');
['todo', 'in_progress', 'review', 'done'].forEach((status) => {
  const r = TaskService.getTasks({ status });
  console.log(`  ${status.padEnd(12)} [${r.count}]`);
});
console.log();

// ── 5. Дедлайны ───────────────────────────────────────────────────────────
console.log('5. Приближающиеся дедлайны (ПЗ_7, ПЗ_24)');
const d24 = TaskService.getApproachingDeadlines(24);
(`Задач с дедлайном в ближайшие 24 ч: ${d24.count}`);
d24.data.forEach((t) => console.log(`      "${t.getTitle()}"`));
console.log();

// ── 6. Комментарий ────────────────────────────────────────────────────────
console.log('6. Комментарий к задаче');
const cmt = TaskService.addComment(tasks[0].id, users[1].id, 'API роуты готовы на 40%.');
if (cmt.success) {(`Комментарий добавлен: ${cmt.data.id}`); }
console.log();

// ── 7. Sprint (ПЗ_23) ─────────────────────────────────────────────────────
console.log('7. Sprint Backlog (ПЗ_23)');
const sprint1 = new Sprint('Sprint 1', new Date(), new Date(Date.now() + 14 * 86400000), 'REST API + Kanban UI');
sprint1.start();
tasks.slice(0, 3).forEach((t) => sprint1.addTask(t));
storage.saveSprint(sprint1);
const sp = sprint1.toJSON();
(`"${sp.name}" | Задач: ${sp.backlogSize} | SP: ${sp.totalStoryPoints} | Прогресс: ${sp.progress}%`);
console.log();

// ── 8. Валидация (ПЗ_24) ──────────────────────────────────────────────────
console.log('8. Валидация и обработка ошибок (ПЗ_24)');
const bad = TaskService.createTask({ title: '' });
if (!bad.success) { (`Невалидная задача отклонена: ${bad.errors.join('; ')}`); }
const notFound = TaskService.getTask('TASK-0000-xxx');
if (!notFound.success) { (`Несуществующая задача: "${notFound.errors[0]}"`); }
console.log();


console.log(`  Итог: ${storage.getAllUsers().length} пользователей, ${storage.getAllTasks().length} задач, ${storage.getAllSprints().length} спринтов`);
