'use strict';

class GoogleCalendarAdapter {
  constructor(apiKey = 'DEMO_KEY') { this._apiKey = apiKey; }

  syncTask(task) {
    const deadline = task.getDeadline() || new Date();
    const event = {
      id:          `gcal-${task.id}`,
      summary:     `[TeamFlow] ${task.getTitle()}`,
      description: task.getDescription(),
      start:       { dateTime: deadline.toISOString() },
      end:         { dateTime: new Date(deadline.getTime() + 3600000).toISOString() },
      colorId:     this._priorityToColor(task.getPriority())
    };
    console.log(`[GoogleCalendar] Синхронизирована: "${event.summary}"`);
    return event;
  }

  deleteEvent(taskId) {
    console.log(`[GoogleCalendar] Удалено событие: gcal-${taskId}`);
  }

  _priorityToColor(priority) {
    const map = { low: '2', medium: '5', high: '6', urgent: '11' };
    return map[priority] || '0';
  }
}

module.exports = GoogleCalendarAdapter;
