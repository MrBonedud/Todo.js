// Import necessary classes for data management
import Project from './Project'
import Task from './Task'
import TodoList from './TodoList'

/**
 * Storage class manages local browser storage for the TodoList application
 * Provides static methods for:
 * - Saving todo list data
 * - Retrieving saved data
 * - Manipulating projects and tasks in persistent storage
 */
export default class Storage {
  /**
   * Save entire TodoList to browser's local storage
   * Converts complex objects to a JSON-serializable format
   * 
   * @param {TodoList} data - TodoList object to save
   */
  static saveTodoList(data) {
    try {
       // Create a simplified, serializable representation of todo list
      const serializedData = {
          projects: data.getProjects().map(project => ({
              name: project.getName(),
              tasks: project.getTasks().map(task => ({
                  name: task.getName(),
                  dueDate: task.getDate(),
                  completed: task.isCompleted()
              }))
          }))
      };

       
      console.log("💾 Saving TodoList:", serializedData);
        // Store serialized data as JSON string
      localStorage.setItem('todoList', JSON.stringify(serializedData));
      console.log("✅ TodoList Successfully Saved");
  } catch (error) {
      console.error("❌ Error saving TodoList:", error);
      alert(`Failed to save data: ${error.message}`);
  }
}

  /**
   * Retrieve TodoList from local storage
   * Reconstructs TodoList if data exists, otherwise creates new
   * 
   * @returns {TodoList} Reconstructed or new TodoList
   */
  static getTodoList() {
    const data = localStorage.getItem('todoList');
    console.log("🔍 Retrieving TodoList:", data);


    // Return new TodoList if no saved data
    if (!data) {
      console.log("🆕 No existing TodoList, creating new");
      return new TodoList();
  }

  try {
    const parsedData = JSON.parse(data);
    const todoList = new TodoList();


        // Manually reconstruct projects and tasks
        todoList.setProjects(
          parsedData.projects.map(projectData => {
              const project = new Project(projectData.name);
              
              const reconstructedTasks = projectData.tasks.map(taskData => {
                  const task = new Task(taskData.name, taskData.dueDate);
                  task.setCompleted(taskData.completed || false);
                  return task;
              });
              
              project.setTasks(reconstructedTasks);
              return project;
          })
      );

      console.log("📊 Loaded TodoList Projects:", todoList.getProjects());
      return todoList;
  } catch (e) {
      console.error('Error loading todo list:', e);
      localStorage.removeItem('todoList');
      return new TodoList();
  }
}


  /**
   * Add a new project to TodoList in local storage
   * Prevents duplicate projects
   * 
   * @param {Project} project - Project to add
   */
  static addProject(project) {
    const todoList = Storage.getTodoList();
    if (!todoList.projects.some(p => p.name === project.name)) {
        todoList.addProject(project);
        Storage.saveTodoList(todoList);
    }
}

  /**
   * Delete a project from TodoList in local storage
   * 
   * @param {string} projectName - Name of project to delete
   */
  static deleteProject(projectName) {
    const todoList = Storage.getTodoList()
    todoList.deleteProject(projectName)
    Storage.saveTodoList(todoList)
  }

  /**
   * Add a task to a specific project in local storage
   * 
   * @param {string} projectName - Name of project to add task to
   * @param {Task} task - Task to add
   */
  static addTask(projectName, task) {
    console.log("📦 Storing Task:", task);

    const todoList = Storage.getTodoList();
    const project = todoList.getProject(projectName);
    
    if (!project) {
        console.error("❌ Project not found:", projectName);
        return;
    }

    project.addTask(task);
    Storage.saveTodoList(todoList);
  }

  /**
   * Delete a task from a specific project in local storage
   * 
   * @param {string} projectName - Name of project containing task
   * @param {string} taskName - Name of task to delete
   */
  static deleteTask(projectName, taskName) {
    const todoList = Storage.getTodoList()
    const project = todoList.getProject(projectName)
    
    // Prevent errors with non-existent projects
    if (!project) {
        console.error(`Project ${projectName} not found`);
        return;
    }
    
    project.deleteTask(taskName)
    Storage.saveTodoList(todoList)
  }

  /**
   * Rename an existing task in a project
   * 
   * @param {string} projectName - Name of project containing task
   * @param {string} taskName - Current task name
   * @param {string} newTaskName - New task name
   */
  static renameTask(projectName, taskName, newTaskName) {
    const todoList = Storage.getTodoList()
    const project = todoList.getProject(projectName)
    
    if (!project) {
        console.error(`Project ${projectName} not found`);
        return;
    }

    // Handle tasks with additional context (e.g., from Today/Week projects)
    const cleanedTaskName = taskName.split(' (')[0]
    const task = project.getTasks().find(t => t.getName() === cleanedTaskName)
    
    if (!task) {
        console.warn(`Task ${cleanedTaskName} not found in project ${projectName}`)
        return
    }

    task.setName(newTaskName)
    Storage.saveTodoList(todoList)
  }

  /**
   * Update task due date in a specific project
   * 
   * @param {string} projectName - Name of project containing task
   * @param {string} taskName - Name of task to update
   * @param {string} newDueDate - New due date for task
   */
  static setTaskDate(projectName, taskName, newDueDate) {
    const todoList = Storage.getTodoList()
    const project = todoList.getProject(projectName)
    if (!project) return

    const task = project.getTask(taskName)
    if (!task) return

    task.setDate(newDueDate)
    Storage.saveTodoList(todoList)
  }

  /**
   * Update default 'Today' project with current day's tasks
   */
  static updateTodayProject() {
    const todoList = Storage.getTodoList()
    todoList.updateTodayProject()
    Storage.saveTodoList(todoList)
  }

  /**
   * Update default 'This Week' project with current week's tasks
   */
  static updateWeekProject() {
    const todoList = Storage.getTodoList()
    todoList.updateWeekProject()
    Storage.saveTodoList(todoList)
  }
}