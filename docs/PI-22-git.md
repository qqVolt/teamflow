```markdown
# PI-22 — Управление версиями

## Инициализация репозитория

```bash
cd teamflow
git init
git branch -M main
git add .
git commit -m "init: начальная структура проекта TeamFlow"
git log --oneline
# Ветка для разработки
git checkout -b develop
git push -u origin develop

# Фича: аутентификация пользователей
git checkout -b feature/authentication
# ... разработка ...
git add src/models/User.js src/services/UserService.js
git commit -m "feat(auth): добавлена модель User с ролями и паролем"
git push origin feature/authentication

# Мерж в develop после code review
git checkout develop
git merge feature/authentication
git push origin develop

# Фича: система задач
git checkout -b feature/task-management
git add src/models/Task.js src/services/TaskService.js
git commit -m "feat(tasks): модель Task с Kanban-статусами и Story Points"
git checkout develop
git merge feature/task-management

# Релиз
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release v1.0.0 — базовая система задач"
git push origin main --tags

main        ←── стабильные релизы
  └── develop ←── интеграционная ветка
        ├── feature/authentication
        ├── feature/task-management
        ├── feature/notifications
        └── feature/sprint-backlog
