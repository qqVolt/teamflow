'use strict';

const Project = require('./Project');

class Sprint {
  constructor(name, startDate, endDate, goal) {
    this.id        = Project.generateId('SPR');
    this.name      = name;
    this.startDate = new Date(startDate);
    this.endDate   = new Date(endDate);
    this.goal      = goal || '';
    this.backlog   = [];
    this.status    = 'planned';
    this.createdAt = new Date();
  }

  addTask(task) {
    if (!task || !task.id) { throw new Error('Невалидный объект задачи'); }
    if (this.backlog.some((b) => b.taskId === task.id)) {
      throw new Error(`Задача ${task.id} уже добавлена в спринт`);
    }
    this.backlog.push({
      taskId:      task.id,
      taskTitle:   task.getTitle(),
      storyPoints: task.getStoryPoints(),
      status:      task.getStatus()
    });
    return this.backlog.length;
  }

  removeTask(taskId) {
    const idx = this.backlog.findIndex((b) => b.taskId === taskId);
    if (idx === -1) { return false; }
    this.backlog.splice(idx, 1);
    return true;
  }

  getTotalStoryPoints() {
    return this.backlog.reduce((s, b) => s + (b.storyPoints || 0), 0);
  }

  getCompletedStoryPoints() {
    return this.backlog
      .filter((b) => b.status === 'done')
      .reduce((s, b) => s + (b.storyPoints || 0), 0);
  }

  getProgress() {
    const total = this.getTotalStoryPoints();
    return total === 0 ? 0 : Math.round((this.getCompletedStoryPoints() / total) * 100);
  }

  start()    { this.status = 'active'; }
  complete() { this.status = 'completed'; }

  toJSON() {
    return {
      id: this.id, name: this.name, goal: this.goal,
      startDate: this.startDate, endDate: this.endDate, status: this.status,
      backlogSize:          this.backlog.length,
      totalStoryPoints:     this.getTotalStoryPoints(),
      completedStoryPoints: this.getCompletedStoryPoints(),
      progress:             this.getProgress()
    };
  }
}

module.exports = Sprint;
