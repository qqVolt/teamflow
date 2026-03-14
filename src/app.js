'use strict';

const db                    = require('./patterns/DatabaseConnection');
const TaskService            = require('./services/TaskService');
const UserService            = require('./services/UserService');
const Sprint                 = require('./models/Sprint');
const TaskManagementFacade   = require('./patterns/TaskManagementFacade');
const Project                = require('./models/Project');
const storage                = require('./storage/InMemoryStorage');

const facade = new TaskManagementFacade();
const hr2 = () => console.log('='.repeat(60));
const hr  = () => console.log('-'.repeat(60));
const ok  = (msg) => console.log(`  ✅ ${msg}`);

hr2();
console.log('  TeamFlow Task Manager v1.0.0');
hr2();
console.log();

// Подключение (Singleton DatabaseConnection)
db.connect();
console.log(`  [DB] connected: ${db.isConnected()}`);
console.log();

// ── 1. Пользователи ────────────────────────────────────────────────────────
console.log('1. Создание пользователей');
hr();
const usersData = [
  { name: 'Иван Петров',    email: 'ivan@tf.ru',   password: 'Admin123', role: 'admin'     },
  { name: 'Ольга Сидорова', email: 'olga@tf.ru',   password: 'Mgr4567',  role: 'manager'   },
  { name: 'Дмитрий Козлов', email: 'dmitry@tf.ru', password: 'Dev7890',  role: 'developer' },
  { name: 'Мария Новикова', email: 'maria@tf.ru',  password: 'Dev1012',  role: 'developer' }
];
const users = [];
usersData.forEach((u) => {
  const r = UserService.createUser(u);
  if (r.success) { users.push(r.data); ok(`${r.data.name} (${r.data.role})`); }
});
const dupCheck = UserService.createUser(usersData[0]);
if (!dupCheck.success) { ok(`Дубликат отклонён: ${dupCheck.errors[0]}`); }
console.log();

// ── 2. Задачи через Facade (Factory + Calendar + Notification) ─────────────
console.log('2. Создание задач (TaskFactory + Facade) (PI-11, PI-12)');
hr();
const tasksData = [
  { title: 'Разработать REST API',    priority: 'high',   status: 'in_progress', assignee: users[2].id, storyPoints: 8,  deadline: new Date(Date.now() + 7 * 86400000) },
  { title: 'Создать Kanban-доску',    priority: 'medium', status: 'todo',        assignee: users[3].id, storyPoints: 13, deadline: new Date(Date.now() + 14 * 86400000) },
  { title: 'Система уведомлений',     priority: 'urgent', status: 'todo',        assignee: users[2].id, storyPoints: 5,  deadline: new Date(Date.now() + 2 * 3600000) },
  { title: 'Написать документацию API', priority: 'low', status: 'todo',        assignee: users[1].id, storyPoints: 3 }
];
const tasks = [];
tasksData.forEach((t) => {
  const r = facade.createTaskWithSync(t, users[0].id);
  if (r.success) { tasks.push(r.data); ok(`"${r.data.getTitle()}" SP:${r.data.getStoryPoints()}`); }
});
console.log();

// ── 3. Полиморфизм (PI-13) ─────────────────────────────────────────────────
console.log('3. Полиморфизм — Task extends Project (PI-13)');
hr();
const project = new Project('TeamFlow', 'Основной проект');
const items   = [project, ...tasks.slice(0, 3)];
console.log('  getInfo() на разнотипных объектах:');
items.forEach((item) => console.log(`    → ${item.getInfo()}`));
ok(`Task instanceof Project = ${tasks[0] instanceof Project}`);
console.log();

// ── 4. Kanban ──────────────────────────────────────────────────────────────
console.log('4. Kanban — состояние доски (PI-23)');
hr();
['todo', 'in_progress', 'review', 'done'].forEach((status) => {
  const r = TaskService.getTasks({ status });
  console.log(`  ${status.padEnd(12)} [${r.count}]`);
});
console.log();

// ── 5. Дедлайны ───────────────────────────────────────────────────────────
console.log('5. Приближающиеся дедлайны (PI-7, PI-24)');
hr();
const d24 = TaskService.getApproachingDeadlines(24);
ok(`Задач с дедлайном в ближайшие 24 ч: ${d24.count}`);
d24.data.forEach((t) => console.log(`    ⚠️  "${t.getTitle()}"`));
console.log();

// ── 6. Комментарий ────────────────────────────────────────────────────────
console.log('6. Комментарий к задаче');
hr();
const cmt = TaskService.addComment(tasks[0].id, users[1].id, 'API роуты готовы на 40%.');
if (cmt.success) { ok(`Комментарий добавлен: ${cmt.data.id}`); }
console.log();

// ── 7. Sprint (PI-23) ─────────────────────────────────────────────────────
console.log('7. Sprint Backlog (PI-23)');
hr();
const sprint1 = new Sprint('Sprint 1', new Date(), new Date(Date.now() + 14 * 86400000), 'REST API + Kanban UI');
sprint1.start();
tasks.slice(0, 3).forEach((t) => sprint1.addTask(t));
storage.saveSprint(sprint1);
const sp = sprint1.toJSON();
ok(`"${sp.name}" | Задач: ${sp.backlogSize} | SP: ${sp.totalStoryPoints} | Прогресс: ${sp.progress}%`);
console.log();

// ── 8. Валидация (PI-24) ──────────────────────────────────────────────────
console.log('8. Валидация и обработка ошибок (PI-24)');
hr();
const bad = TaskService.createTask({ title: '' });
if (!bad.success) { ok(`Невалидная задача отклонена: ${bad.errors.join('; ')}`); }
const notFound = TaskService.getTask('TASK-0000-xxx');
if (!notFound.success) { ok(`Несуществующая задача: "${notFound.errors[0]}"`); }
console.log();

hr2();
console.log(`  Итог: ${storage.getAllUsers().length} пользователей, ${storage.getAllTasks().length} задач, ${storage.getAllSprints().length} спринтов`);
hr2();
