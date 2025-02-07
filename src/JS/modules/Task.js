/**
 * Task class represents a single task with a name and due date
 * Provides methods for managing task properties with validation
 */
export default class Task {
    /**
     * Create a new task
     * @param {string} name - Task name
     * @param {string} dueDate - Due date in DD/MM/YYYY format (default: 'No date')
     * @throws {Error} If task name is invalid
     */
    constructor(name, dueDate = 'No date') {
        if (!name || typeof name !== 'string' || name.trim() === '') {
            throw new Error('Invalid task name');
        }
        this.name = name;
        this.dueDate = dueDate;
        this.completed = false;  
    }
  
    setCompleted(completed) {
        this.completed = completed;
    }

    isCompleted() {
        return this.completed;
    }
    /**
     * Update task name with validation
     * @param {string} name - New task name
     * @throws {Error} If name is invalid
     */
    setName(name) {
        if (typeof name !== 'string' || name.trim() === '') {
            throw new Error('Invalid task name');
        }
        this.name = name.trim();
    }
  
    /**
     * Retrieve the current task name
     * @returns {string} Task name
     */
    getName() {
        return this.name;
    }
  
    /**
     * Set the task's due date with format validation
     * @param {string} dueDate - Due date in DD/MM/YYYY format
     * @throws {Error} If date format is invalid
     */
    setDate(dueDate) {
        // Validate date format
        if (dueDate !== 'No date') {
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!dateRegex.test(dueDate)) {
                throw new Error('Invalid date format. Use DD/MM/YYYY');
            }
        }
        this.dueDate = dueDate;
    }
  
    /**
     * Get the task's due date
     * @returns {string} Due date
     */
    getDate() {
        return this.dueDate;
    }
  
    /**
     * Get the date formatted for display
     * Converts from DD/MM/YYYY to MM/DD/YYYY
     * @returns {string} Formatted date or 'No date'
     */
    getDateFormatted() {
        if (this.dueDate === 'No date') {
            return this.dueDate;
        }
  
        const [day, month, year] = this.dueDate.split('/');
        return `${month}/${day}/${year}`;
    }
  }