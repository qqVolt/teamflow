# PI-21 — Рефакторинг

## Исходный монолит (ДО)

```js
// taskmanager-before.js — всё в одном файле, нарушение SRP
var tasks = []
var users = []

function crtsk(a, b, c) {     // плохое имя, var, нет валидации
  var o = {}
  o.title = a; o.priority = b; o.assignee = c
  tasks.push(o)
  return o
}

function updsk(id, st) {
  tasks[id].status = st       // нет проверки допустимых значений
}

function getUsr(email) {
  for (var i = 0; i < users.length; i++) {   // var в цикле
    if (users[i].email == email) return users[i]  // == вместо ===
  }
}

Проблемы до рефакторинга:

Всё в одном файле — нарушение SRP (SOLID)

var вместо const/let

Имена crtsk, a, b — не читаемы

== вместо ===

Нет валидации входных данных

Нет обработки ошибок

После рефакторинга (ПОСЛЕ)
Разделение на модули по принципу SRP:
| Файл                           | Ответственность                |
| ------------------------------ | ------------------------------ |
| src/models/Project.js          | Базовый класс, генерация ID    |
| src/models/Task.js             | Данные и бизнес-правила задачи |
| src/models/User.js             | Данные и права пользователя    |
| src/storage/InMemoryStorage.js | Хранение данных (Singleton)    |
| src/services/TaskService.js    | Бизнес-логика задач            |
| src/services/UserService.js    | Бизнес-логика пользователей    |
| src/patterns/TaskFactory.js    | Создание задач по типу         |

Применённые принципы SOLID
S (SRP): каждый модуль — одна ответственность
O (OCP): TaskFactory расширяется новыми типами без изменения существующего кода
L (LSP): Task extends Project — можно использовать Task везде, где Project
D (DIP): TaskService зависит от абстракции storage, не от конкретного класса

npm test
# PASS  tests/Task.test.js
# PASS  tests/User.test.js
# PASS  tests/TaskService.test.js
