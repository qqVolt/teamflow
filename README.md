# TeamFlow Task Manager

Система управления задачами для команды разработки.

## Быстрый старт

```bash
npm install
npm start       # Запуск демонстрации
npm test        # Запуск тестов с coverage
npm run lint    # Проверка кода ESLint

| Папка         | Содержимое                                               |
| ------------- | -------------------------------------------------------- |
| src/models/   | Классы данных: Project, Task, User, Notification, Sprint |
| src/patterns/ | Паттерны: Singleton, Factory, Adapter, Facade            |
| src/services/ | Бизнес-логика: TaskService, UserService                  |
| src/storage/  | InMemoryStorage (Singleton)                              |
| tests/        | Jest unit-тесты                                          |
| bad-code/     | Намеренно плохой код для ПЗ_19                           |
| docs/         | Документация по ПЗ_19..ПЗ_24                             |


***

## Инструкция по запуску

После того, как все файлы созданы:

```bash
# 1. Установить зависимости
npm install
# 2. Запустить демонстрацию
npm start
# 3. Запустить тесты
npm test
# 4. Проверить плохой код (ПЗ_19 — ожидаешь 13 ошибок)
npx eslint bad-code/TaskBad.js
# 5. Проверить хороший код (ПЗ_19 — ожидаешь 0 ошибок)
npx eslint src/
# 6. Git (ПЗ_22)
git init
git branch -M main
git add .
git commit -m "init: TeamFlow v1.0.0"
git checkout -b develop
git checkout -b feature/task-management
git checkout develop
git merge feature/task-management
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release v1.0.0"


