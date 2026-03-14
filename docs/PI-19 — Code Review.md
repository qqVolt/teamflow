# PI-19 — Code Review

## 1. Исходный код с проблемами (ДО)

Файл: `bad-code/TaskBad.js`

Запуск проверки:
```bash
npx eslint bad-code/TaskBad.js

bad-code/TaskBad.js
  3:1  error  Unexpected var, use let or const instead  no-var
  3:11 error  Missing semicolon                         semi
  4:1  error  Unexpected var, use let or const instead  no-var
  5:1  error  Unexpected var, use let or const instead  no-var
  8:4  error  Unexpected var, use let or const instead  no-var
  8:41 error  Missing semicolon                         semi
  9:3  error  Unexpected if as the only statement...    no-lonely-if
  9:38 error  Missing semicolon                         semi
 14:10 error  Use object spread instead of Object.assign  no-new-object
 22:1  error  'makeTask' duplicates createTask          (DRY violation)
 37:18 error  Strings must use singlequote              quotes
 37:28 error  Unexpected string concatenation           prefer-template
 42:1  warning 'unusedVar' is assigned but never used   no-unused-vars

✖ 13 проблем (12 ошибок, 1 предупреждение)

| №  | Проблема                                   | Тип                    | Серьёзность |
| -- | ------------------------------------------ | ---------------------- | ----------- |
| 1  | var a, var b, var c — бессмысленные имена  | Стиль                  | Высокая     |
| 2  | var вместо const/let                       | ESLint no-var          | Высокая     |
| 3  | Нет точек с запятой                        | ESLint semi            | Средняя     |
| 4  | Двойные кавычки                            | ESLint quotes          | Низкая      |
| 5  | new Object() вместо {}                     | ESLint no-new-object   | Средняя     |
| 6  | "str" + var вместо template literal        | ESLint prefer-template | Средняя     |
| 7  | createTask и makeTask — дублирование (DRY) | Архитектура            | Высокая     |
| 8  | Нет валидации в updateTask                 | Логика                 | Критично    |
| 9  | Закомментированный мёртвый код             | Стиль                  | Низкая      |
| 10 | unusedVar — лишняя переменная              | ESLint no-unused-vars  | Низкая      |

npx eslint src/models/Task.js
# Вывод: 0 проблем ✅





***

## `docs/PI-20-validation.md`

```markdown
# PI-20 — Валидация требований

## Функциональные требования

| # | Требование | Статус | Реализация |
|---|---|---|---|
| FR-1 | Создание задачи с title, priority, status | ✅ Реализовано | `Task`, `TaskService.createTask()` |
| FR-2 | Назначение задачи пользователю (assignee) | ✅ Реализовано | `Task.setAssignee()`, `TaskService` |
| FR-3 | Канбан-статусы: todo / in_progress / review / done | ✅ Реализовано | `VALID_STATUSES`, `Task.setStatus()` |
| FR-4 | Комментарии к задачам | ✅ Реализовано | `Task.addComment()`, `TaskService.addComment()` |
| FR-5 | Уведомления при назначении и закрытии задачи | ✅ Реализовано | `Notification`, `TaskManagementFacade` |
| FR-6 | Дедлайны и предупреждения | ✅ Реализовано | `Task.isDeadlineApproaching()`, `TaskService.getApproachingDeadlines()` |
| FR-7 | Роли пользователей (admin / manager / developer / viewer) | ✅ Реализовано | `User.hasPermission()`, `ROLE_PERMISSIONS` |
| FR-8 | Story Points и Sprint Backlog | ✅ Реализовано | `Task.storyPoints`, `Sprint` |

## Нефункциональные требования

| # | Требование | Статус | Примечание |
|---|---|---|---|
| NFR-1 | Валидация всех входных данных | ✅ | `validate()` в Task, User |
| NFR-2 | Обработка ошибок в сервисах | ✅ | `try/catch` + `{ success, errors }` |
| NFR-3 | Модульная структура кода | ✅ | Отдельные файлы по слоям |
| NFR-4 | Покрытие тестами | ✅ | 30+ unit-тестов (Jest) |
| NFR-5 | Соответствие стандарту кода | ✅ | ESLint 8, 0 ошибок |

## Use Cases

**UC-1: Создание задачи**
- Актор: manager / admin
- Шаги: менеджер вводит title, priority, deadline → система валидирует → создаёт Task → уведомляет assignee
- Альтернатива: невалидные данные → система возвращает `{ success: false, errors }`

**UC-2: Смена статуса (Kanban)**
- Актор: developer
- Шаги: разработчик меняет статус → Facade обновляет Task → при `done` → уведомление создателю

**UC-3: Просмотр дедлайнов**
- Актор: любой пользователь с правом `read`
- Шаги: запрос `getApproachingDeadlines(24)` → список задач с дедлайном < 24 ч
