// Project.js
/**
 * Project class represents a collection of tasks
 * Handles task management operations like adding, deleting, and filtering tasks
 */
import { toDate, isToday, isThisWeek, subDays } from 'date-fns'

export default class Project {
  /**
   * Create a new project
   * @param {string} name - The name of the project
   */
  constructor(name) {
    this.name = name
    this.tasks = [] // Initialize empty tasks array
  }

  /**
   * Set the project name
   * @param {string} name - New project name
   */
  setName(name) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Invalid project name')
    }
    this.name = name.trim()
  }

  /**
   * Get the project name
   * @returns {string} Project name
   */
  getName() {
    return this.name
  }

  /**
   * Set the project's tasks
   * @param {Array} tasks - Array of Task objects
   */
  setTasks(tasks) {
    if (!Array.isArray(tasks)) {
      throw new Error('Tasks must be an array')
    }
    this.tasks = tasks
  }

  /**
   * Get all tasks in the project
   * @returns {Array} Array of Task objects
   */
  getTasks() {
    return this.tasks
  }

  /**
   * Find a specific task by name
   * @param {string} taskName - Name of the task to find
   * @returns {Task|undefined} Found task or undefined
   */
  getTask(taskName) {
    return this.tasks.find((task) => task.getName() === taskName)
  }

  /**
   * Check if project contains a task with given name
   * @param {string} taskName - Name to check
   * @returns {boolean} True if task exists
   */
  contains(taskName) {
    return this.tasks.some((task) => task.getName() === taskName)
  }

  /**
   * Add a new task to the project
   * @param {Task} newTask - Task object to add
   */
  addTask(newTask) {
    console.log("🔧 Attempting to add task:", newTask);

    // Check for duplicate task names
    const existingTask = this.tasks.find((task) => task.getName() === newTask.getName());
    
    if (existingTask) {
        console.warn("⚠️ Duplicate task found, skipping:", newTask.getName());
        return;
    }

    this.tasks.push(newTask);
    console.log("✅ Task added successfully. Current tasks:", 
        this.tasks.map(task => `${task.getName()} (${task.getDate()})`));
}
  /**
   * Delete a task by name
   * @param {string} taskName - Name of task to delete
   */
  deleteTask(taskName) {
    this.tasks = this.tasks.filter((task) => task.getName() !== taskName)
  }

  /**
   * Get tasks due today
   * @returns {Array} Array of tasks due today
   */
  getTasksToday() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormatted())
      return isToday(toDate(taskDate))
    })
  }

  /**
   * Get tasks due this week
   * @returns {Array} Array of tasks due this week
   */
  getTasksThisWeek() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormatted())
      return isThisWeek(subDays(toDate(taskDate), 1))
    })
  }
}