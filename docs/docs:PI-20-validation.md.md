
***



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