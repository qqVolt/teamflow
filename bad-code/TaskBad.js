// TaskBad.js — намеренно плохой код для демонстрации ревью (ПЗ_19)
// ВНИМАНИЕ: этот файл содержит типичные ошибки стиля и качества

var a = 'todo'   // var вместо const/let, нет точки с запятой
var b = 'medium'
var c = 0

// Магические числа, неосмысленные имена
function chk(x, h) {
   var d = (x - Date.now()) / 3600000   // что за 3600000?
   if (d > 0 && d <= h) { return true } else { return false }
}

// Дублирование логики (нарушение DRY)
function createTask(a, b, c, d, e) {
      var obj = new Object()   // new Object() вместо {}
      obj["title"] = a         // скобочная нотация без причины
      obj["priority"] = b
      obj["status"] = c
      obj["assignee"] = d
      obj["storyPoints"] = e
      return obj
}

// Дублирует createTask
function makeTask(t, p, s, u, sp) {
   var o = {}
   o.title = t; o.priority = p; o.status = s; o.assignee = u; o.storyPoints = sp
   return o
}

// Нет валидации — принимаем что угодно
function updateTask(task, newStatus) {
   task.status = newStatus   // нет проверки допустимых значений
   return task
}

// Мёртвый код
// function oldMethod() {
//   console.log("старый вариант")
//   return null
// }

// Конкатенация вместо template literal, смешение кавычек
function logTask(task) {
   console.log("Задача: " + task.title + ', статус: ' + task.status)
   console.log("Приоритет: " + task.priority)
}

var unusedVar = 42   // переменная объявлена и не используется
