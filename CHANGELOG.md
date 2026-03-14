
***

## `CHANGELOG.md`

```markdown
# Changelog — TeamFlow Task Manager

## [1.0.0] — 2026-03-14

### Added
- Базовые модели: `Project`, `Task`, `User`, `Notification`, `Sprint`
- Наследование `Task extends Project` (PI-13)
- Паттерн Singleton: `DatabaseConnection`, `InMemoryStorage` (PI-11)
- Паттерн Factory: `TaskFactory` (PI-11)
- Паттерн Adapter: `GoogleCalendarAdapter` (PI-12)
- Паттерн Facade: `TaskManagementFacade` (PI-12)
- Сервисы с обработкой ошибок: `TaskService`, `UserService` (PI-24)
- Kanban-статусы: todo / in_progress / review / done (PI-23)
- Story Points и Sprint Backlog (PI-23)
- Система ролей и прав: admin / manager / developer / viewer (PI-7)
- Уведомления о назначении задачи и завершении
- Предупреждения о приближающихся дедлайнах
- Unit-тесты: 30+ тестов (Jest) (PI-17)
- CI/CD: GitHub Actions workflow (PI-18)
- ESLint конфигурация, 0 ошибок (PI-19)
