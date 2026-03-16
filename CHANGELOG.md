
***

## `CHANGELOG.md`

```markdown
# Changelog — TeamFlow Task Manager

## [1.0.0] — 2026-03-14

### Added
- Базовые модели: `Project`, `Task`, `User`, `Notification`, `Sprint`
- Наследование `Task extends Project` (ПЗ_3)
- Паттерн Singleton: `DatabaseConnection`, `InMemoryStorage` (ПЗ_11)
- Паттерн Factory: `TaskFactory` (ПЗ_11)
- Паттерн Adapter: `GoogleCalendarAdapter` (ПЗ_12)
- Паттерн Facade: `TaskManagementFacade` (ПЗ_12)
- Сервисы с обработкой ошибок: `TaskService`, `UserService` (ПЗ_24)
- Kanban-статусы: todo / in_progress / review / done (ПЗ_23)
- Story Points и Sprint Backlog (ПЗ_23)
- Система ролей и прав: admin / manager / developer / viewer (ПЗ_7)
- Уведомления о назначении задачи и завершении
- Предупреждения о приближающихся дедлайнах
- Unit-тесты: 30+ тестов (Jest) (ПЗ_17)
- CI/CD: GitHub Actions workflow (ПЗ_18)
- ESLint конфигурация, 0 ошибок (ПЗ_19)
