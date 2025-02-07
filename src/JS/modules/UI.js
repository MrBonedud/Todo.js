import { format } from 'date-fns'
import Storage from './Storage'
import Project from './Project'
import Task from './Task'
import addTaskIcon from '../../img/add-task.svg';
import checkboxIcon from '../../img/checkbox.svg';
import deleteIcon from '../../img/delete.svg';
import projectIcon from '../../img/project.svg';
import inboxIcon from '../../img/inbox.svg';
import todayIcon from '../../img/calendar-today.svg';
import weekIcon from '../../img/calendar-week.svg';
import addProjectIcon from '../../img/add-task.svg';

import '../../CSS/styles.css';

export default class UI {
    static loadHomepage() {
        UI.initializeIcons(); 
        UI.loadProjects();
        UI.initProjectButtons();
        UI.openProject('Inbox', document.getElementById('button-inbox-projects'));
        document.addEventListener('keydown', UI.handleKeyboardInput);
    }
    
    static initializeIcons() {
        const plusBoxIcon = document.getElementById('plus-box');
        if (plusBoxIcon) {
            plusBoxIcon.src = addTaskIcon;
        }
        document.getElementById('inbox').src = inboxIcon;
        document.getElementById('calendar-today').src = todayIcon;
        document.getElementById('calendar-week').src = weekIcon;
        document.getElementById('plus-box').src = addProjectIcon;
    }

    static loadProjects() {
        UI.clearProjects();

        Storage.getTodoList()
            .getProjects()
            .forEach((project) => {
                if (
                    project.name !== 'Inbox' &&
                    project.name !== 'Today' &&
                    project.name !== 'This week'
                ) {
                    UI.createProject(project.name);
                }
            });

        UI.initAddProjectButtons();
        UI.initEditProjectName();
    }

    static loadTasks(projectName) {
        console.log(`🔍 Loading Tasks for Project: ${projectName}`);
        
        try {
            const todoList = Storage.getTodoList();
            if (!todoList) {
                console.error('TodoList not found in storage');
                return;
            }

            const project = todoList.getProject(projectName);
            if (!project) {
                console.error(`Project "${projectName}" not found`);
                return;
            }

            const tasks = project.getTasks();
            if (!tasks) {
                console.error(`No tasks found for project "${projectName}"`);
                return;
            }
            
            console.log('📋 Tasks Found:', tasks.map(task => `${task.getName()} (${task.getDate()})`));
            
            const tasksList = document.getElementById('tasks-list');
            if (!tasksList) {
                console.error('Tasks list element not found');
                return;
            }

            tasksList.innerHTML = '';
            
            tasks.forEach((task) => {
                console.log(`🚩 Task: ${task.getName()}, Due Date: ${task.getDate()}`);
                UI.createTask(task.getName(), task.getDate());
            });
        
            if (projectName !== 'Today' && projectName !== 'This week') {
                UI.initAddTaskButtons();
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    static loadProjectContent(projectName) {
        const projectPreview = document.getElementById('project-preview');
        projectPreview.innerHTML = `
            <h1 class="project-name" id="project-name">${projectName}</h1>
            <div class="tasks-list" id="tasks-list"></div>`;
    
        if (projectName !== 'Today' && projectName !== 'This week') {
            projectPreview.innerHTML += `
            <button class="button-add-task" id="button-add-task">
                <svg class="task-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Task
            </button>
            <div class="add-task-popup" id="add-task-popup">
                <input class="input-add-task-popup" id="input-add-task-popup" type="text" placeholder="Enter task name"/>
                <div class="add-task-popup-buttons">
                    <button class="button-add-task-popup" id="button-add-task-popup">Add</button>
                    <button class="button-cancel-task-popup" id="button-cancel-task-popup">Cancel</button>
                </div>
            </div>`;
    
            UI.initAddTaskButtons();
        }
    
        UI.loadTasks(projectName);
    }

    static createProject(name) {
        const userProjects = document.getElementById('projects-list');
    
        if ([...userProjects.children].some(btn => btn.innerText === name)) return;
    
        userProjects.innerHTML += `
            <button class="button-project" data-project-button>
                <div class="left-project-panel">
                    <img src="${projectIcon}" class="sidebar-img" alt="Project Icon"/>
                    <span>${name}</span>
                </div>
                <div class="right-project-panel">
                    <img src="${deleteIcon}" class="delete-icon" alt="Delete Project"/>
                </div>
            </button>`;
    
        UI.initProjectButtons();
    }

    static createTask(name, dueDate) {
        const tasksList = document.getElementById('tasks-list');
        if (!tasksList) {
            console.error("Tasks list element not found!");
            return;
        }
    
        const taskElement = document.createElement('button');
        taskElement.className = 'button-task';
        taskElement.setAttribute('data-task-button', '');
    
        taskElement.innerHTML = `
            <div class="left-task-panel">
                <img src="${checkboxIcon}" class="checkbox-icon" alt="Complete Task" style="width: 20px; height: 20px; cursor: pointer;"/>
                <p class="task-content">${name}</p>
                <input type="text" class="input-task-name" data-input-task-name style="display: none;"/>
            </div>
            <div class="right-task-panel">
                <p class="due-date">${dueDate || 'No date'}</p>
                <input type="date" class="input-due-date" data-input-due-date style="display: none;"/>
                <img src="${deleteIcon}" class="delete-icon" alt="Delete Task" style="width: 20px; height: 20px; cursor: pointer;"/>
            </div>`;
    
        taskElement.querySelector('.task-content').addEventListener('dblclick', function() {
            UI.openEditTaskName(taskElement);
        });
    
        tasksList.appendChild(taskElement);
        UI.initTaskButtons();
    }
    
    

    static clear() {
        UI.clearProjectPreview()
        UI.clearProjects()
        UI.clearTasks()
    }

    static clearProjectPreview() {
        const projectPreview = document.getElementById('project-preview')
        projectPreview.textContent = ''
    }

    static clearProjects() {
        const projectsList = document.getElementById('projects-list')
        projectsList.textContent = ''
    }

    static clearTasks() {
        const tasksList = document.getElementById('tasks-list')
        if (tasksList) {
            tasksList.textContent = ''
        }
    }

    static closeAllPopups() {
        UI.closeAddProjectPopup()
        const addTaskButton = document.getElementById('button-add-task')
        if (addTaskButton) {
            UI.closeAddTaskPopup()
        }
        if (
            document.getElementById('tasks-list') &&
            document.getElementById('tasks-list').innerHTML !== ''
        ) {
            UI.closeAllInputs()
        }
    }

    static closeAllInputs() {
        const taskButtons = document.querySelectorAll('[data-task-button]')
        taskButtons.forEach((button) => {
            UI.closeRenameInput(button)
            UI.closeSetDateInput(button)
        })
    }

    static handleKeyboardInput(e) {
        if (e.key === 'Escape') UI.closeAllPopups()
    }

    static initAddProjectButtons() {
        const addProjectButton = document.getElementById('button-add-project');
        const addProjectPopupButton = document.getElementById('button-add-project-popup');
        const cancelProjectPopupButton = document.getElementById('button-cancel-project-popup');
        const addProjectPopupInput = document.getElementById('input-add-project-popup');

        addProjectButton.addEventListener('click', UI.openAddProjectPopup);
        addProjectPopupButton.addEventListener('click', UI.addProject);
        cancelProjectPopupButton.addEventListener('click', UI.closeAddProjectPopup);
        addProjectPopupInput.addEventListener('keypress', UI.handleAddProjectPopupInput);
    }

    static initEditProjectName() {
        const projectButtons = document.querySelectorAll('.button-project');
        
        projectButtons.forEach(button => {
            const projectNameSpan = button.querySelector('span');
            
            projectNameSpan.addEventListener('dblclick', function(e) {
                const currentName = this.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentName;
                input.className = 'edit-project-name';
                
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        const newName = this.value.trim();
                        if (!newName) {
                            alert("Project name cannot be empty");
                            return;
                        }
                        
                        try {
                            const todoList = Storage.getTodoList();
                            if (todoList.contains(newName) && newName !== currentName) {
                                alert("A project with this name already exists");
                                return;
                            }
                            
                            const project = todoList.getProject(currentName);
                            project.setName(newName);
                            Storage.saveTodoList(todoList);
                            
                            // Update the project name in the sidebar
                            projectNameSpan.textContent = newName;
                            
                            // Update the project name in the header if this is the currently active project
                            const projectHeader = document.getElementById('project-name');
                            if (projectHeader && projectHeader.textContent === currentName) {
                                projectHeader.textContent = newName;
                            }
                            
                            // If this project button is active, update its content
                            if (button.classList.contains('active')) {
                                UI.loadProjectContent(newName);
                            }
                            
                            this.remove();
                            projectNameSpan.style.display = 'inline';
                        } catch (error) {
                            console.error('Error renaming project:', error);
                            alert('Failed to rename project. Please try again.');
                        }
                    }
                });
                
                this.style.display = 'none';
                this.parentNode.insertBefore(input, this);
                input.focus();
            });
        });
    }

    static openAddProjectPopup() {
        const addProjectPopup = document.getElementById('add-project-popup');
        const addProjectButton = document.getElementById('button-add-project');
        const addProjectInput = document.getElementById('input-add-project-popup');
        
        if (!addProjectPopup || !addProjectButton || !addProjectInput) {
            console.error("Required elements not found");
            return;
        }

        // Clear any previous value before showing popup
        addProjectInput.value = '';
        
        UI.closeAllPopups();
        addProjectPopup.classList.add('active');
        addProjectButton.classList.add('active');
        addProjectInput.focus();
    }

    static closeAddProjectPopup() {
        const addProjectPopup = document.getElementById('add-project-popup');
        const addProjectButton = document.getElementById('button-add-project');
        const addProjectPopupInput = document.getElementById('input-add-project-popup');

        if (addProjectPopup) addProjectPopup.classList.remove('active');
        if (addProjectButton) addProjectButton.classList.remove('active');
        if (addProjectPopupInput) addProjectPopupInput.value = '';
    }

    static addProject() {
        const addProjectPopupInput = document?.getElementById('input-add-project-popup');
        const projectName = addProjectPopupInput?.value.trim();
    
        if (!projectName) {
            alert("Project name can't be empty");
            return; 
        }
    
        try {
            const todoList = Storage.getTodoList();
            if (todoList.contains(projectName)) {
                alert("A project with this name already exists");
                return;
            }
    
            const newProject = new Project(projectName);
            Storage.addProject(newProject); // Remove error handling from Storage class
            UI.createProject(projectName);
            UI.closeAddProjectPopup();
        } catch (error) {
            // Only show error here, not in Storage class
            console.error("Error adding project:", error);
        }
    }

    static openInboxTasks() {
        UI.openProject('Inbox', this)
    }

    static openTodayTasks() {
        Storage.updateTodayProject()
        UI.openProject('Today', this)
    }

    static openWeekTasks() {
        Storage.updateWeekProject()
        UI.openProject('This week', this)
    }

    static handleProjectButton(e) {
        const projectName = this.children[0].children[1].textContent

        if (e.target.classList.contains('delete-icon')) {
            UI.deleteProject(projectName, this)
            return
        }

        UI.openProject(projectName, this)
    }

    static openProject(projectName, projectButton) {
        const defaultProjectButtons = document.querySelectorAll('.button-default-project')
        const projectButtons = document.querySelectorAll('.button-project')
        const buttons = [...defaultProjectButtons, ...projectButtons]
    
        buttons.forEach((button) => button.classList.remove('active'))
        projectButton.classList.add('active')
        UI.closeAddProjectPopup()
        UI.loadProjectContent(projectName)
    }

    static deleteProject(projectName, button) {
        if (button.classList.contains('active')) UI.clearProjectPreview();
    
        Storage.deleteProject(projectName);
        UI.clearProjects();
        UI.loadProjects();
    }

    static initAddTaskButtons() {
        console.log("🔍 Initializing Add Task Buttons");
        const addTaskButton = document.getElementById('button-add-task')
        const addTaskPopupButton = document.getElementById('button-add-task-popup')
        const cancelTaskPopupButton = document.getElementById('button-cancel-task-popup')
        const addTaskPopupInput = document.getElementById('input-add-task-popup')
    
        if (addTaskButton) addTaskButton.addEventListener('click', UI.openAddTaskPopup)
        if (addTaskPopupButton) addTaskPopupButton.addEventListener('click', UI.addTask)
        if (cancelTaskPopupButton) cancelTaskPopupButton.addEventListener('click', UI.closeAddTaskPopup)
        if (addTaskPopupInput) addTaskPopupInput.addEventListener('keypress', UI.handleAddTaskPopupInput)
    }

    static openAddTaskPopup() {
        const addTaskPopup = document.getElementById('add-task-popup');
        const addTaskButton = document.getElementById('button-add-task');

        if (!addTaskPopup || !addTaskButton) return;

        UI.closeAllPopups();
        addTaskPopup.style.display = 'flex';
        addTaskButton.classList.add('active');
    }

    static closeAddTaskPopup() {
        const addTaskPopup = document.getElementById('add-task-popup')
        const addTaskButton = document.getElementById('button-add-task')
        const addTaskInput = document.getElementById('input-add-task-popup')

        if (addTaskPopup) addTaskPopup.style.display = 'none'
        if (addTaskButton) addTaskButton.classList.remove('active')
        if (addTaskInput) addTaskInput.value = ''
    }

    static addTask() {
        const projectName = document.getElementById('project-name')?.textContent;
        const addTaskPopupInput = document.getElementById('input-add-task-popup');
        
        if (!projectName || !addTaskPopupInput) {
            console.error("Required elements not found");
            return;
        }

        const taskName = addTaskPopupInput.value.trim();
        
        if (!taskName) {
            alert("Task name can't be empty");
            return;
        }

        try {
            const todoList = Storage.getTodoList();
            const project = todoList.getProject(projectName);

            if (!project) {
                throw new Error(`Project "${projectName}" not found`);
            }

            if (project.contains(taskName)) {
                alert('Task names must be different within the same project');
                return;
            }

            const task = new Task(taskName, 'No date');
            Storage.addTask(projectName, task);
            UI.createTask(taskName, 'No date');
            UI.closeAddTaskPopup();
            
            addTaskPopupInput.value = '';
        } catch (error) {
            console.error("Error adding task:", error);
            alert(error.message);
        }
    }

    static handleAddTaskPopupInput(e) {
        if (e.key === 'Enter') UI.addTask()
    }

    static handleAddProjectPopupInput(e) {
        if (e.key === 'Enter') {
            UI.addProject();
        }
    }

    static initTaskButtons() {
        const taskButtons = document.querySelectorAll('[data-task-button]');
        const taskNameInputs = document.querySelectorAll('[data-input-task-name]');
        const dueDateInputs = document.querySelectorAll('[data-input-due-date]');

        taskButtons.forEach((taskButton) => 
            taskButton.addEventListener('click', UI.handleTaskButton)
        );    

        taskNameInputs.forEach((taskNameInput) => {
            taskNameInput.removeEventListener('keypress', UI.renameTask);
            taskNameInput.addEventListener('keypress', UI.renameTask);
        });

        dueDateInputs.forEach((dueDateInput) => {
            dueDateInput.removeEventListener('change', UI.setTaskDate);
            dueDateInput.removeEventListener('keypress', UI.setTaskDate);
            dueDateInput.addEventListener('change', UI.setTaskDate);
            dueDateInput.addEventListener('keypress', UI.setTaskDate);
        });
    }

    static initProjectButtons() {
        const inboxProjectButton = document.getElementById('button-inbox-projects')
        const todayProjectButton = document.getElementById('button-today-projects')
        const weekProjectButton = document.getElementById('button-week-projects')
        const projectButtons = document.querySelectorAll('[data-project-button]')
        
        if (inboxProjectButton) inboxProjectButton.addEventListener('click', UI.openInboxTasks)
        if (todayProjectButton) todayProjectButton.addEventListener('click', UI.openTodayTasks)
        if (weekProjectButton) weekProjectButton.addEventListener('click', UI.openWeekTasks)
        
        projectButtons.forEach((projectButton) =>
            projectButton.addEventListener('click', UI.handleProjectButton)
        )
    }

    static openEditTaskName(taskButton) {
        const taskNameElement = taskButton.querySelector('.task-content');
        const taskNameInput = taskButton.querySelector('.input-task-name');
    
        taskNameElement.style.display = 'none';
        taskNameInput.style.display = 'block';
        taskNameInput.value = taskNameElement.textContent;
        taskNameInput.focus();
    
        taskNameInput.addEventListener('keypress', UI.renameTask);
        
        taskNameInput.addEventListener('blur', function() {
            UI.closeRenameInput(taskButton);
        });
    }

    static handleTaskButton(e) {
        if (e.target.closest('.checkbox-icon')) {
            UI.toggleTaskCompleted(this);
            return;
        }
    
        if (e.target.closest('.delete-icon')) {
            UI.deleteTask(this);
            return;
        }
    
        if (e.target.classList.contains('task-content')) {
            UI.openEditTaskName(this);
            return;
        }
    
        if (e.target.classList.contains('due-date')) {
            UI.openSetDateInput(this);
        }
    }
    
    static toggleTaskCompleted(taskButton) {
        const projectName = document.getElementById('project-name').textContent;
        const taskName = taskButton.children[0].children[1].textContent;
        const taskText = taskButton.children[0].children[1];
        const taskIcon = taskButton.children[0].children[0];
    
        // Toggle completed state
        const isCompleted = taskText.style.textDecoration === 'line-through';
        const newCompletedState = !isCompleted;
    
        // Update visual state
        taskText.style.textDecoration = newCompletedState ? 'line-through' : 'none';
        taskIcon.style.color = newCompletedState ? 'green' : 'currentColor';
    
        // Update storage
        const todoList = Storage.getTodoList();
        let targetProject = projectName;
        let targetTaskName = taskName;
    
        if (projectName === 'Today' || projectName === 'This week') {
            const parentProjectName = taskName.split('(')[1].split(')')[0];
            targetProject = parentProjectName;
            targetTaskName = taskName.split(' ')[0];
        }
    
        const project = todoList.getProject(targetProject);
        const task = project.getTask(targetTaskName);
        
        if (task) {
            task.setCompleted(newCompletedState);
            Storage.saveTodoList(todoList);
    
            // Update Today/Week views if necessary
            if (projectName === 'Today') {
                Storage.updateTodayProject();
            } else if (projectName === 'This week') {
                Storage.updateWeekProject();
            }
        }
    }

    static deleteTask(taskButton) {
        const projectName = document.getElementById('project-name').textContent;
        const taskName = taskButton.children[0].children[1].textContent;
    
        try {
            if (projectName === 'Today' || projectName === 'This week') {
                const parentProjectName = taskName.split('(')[1].split(')')[0];
                const mainTaskName = taskName.split(' ')[0];
                
                Storage.deleteTask(parentProjectName, mainTaskName);
                
                if (projectName === 'Today') {
                    Storage.updateTodayProject();
                } else {
                    Storage.updateWeekProject();
                }
            } else {
                Storage.deleteTask(projectName, taskName);
            }
    
            taskButton.remove();
            
            UI.clearTasks();
            UI.loadTasks(projectName);
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        }
    }

    static setTaskCompleted(taskButton) {
        const projectName = document.getElementById('project-name').textContent;
        const taskName = taskButton.children[0].children[1].textContent;
    
        // Handle task deletion in different project contexts
        if (projectName === 'Today' || projectName === 'This week') {
            const parentProjectName = taskName.split('(')[1].split(')')[0];
            Storage.deleteTask(parentProjectName, taskName.split(' ')[0]);
            if (projectName === 'Today') {
                Storage.updateTodayProject();
            } else {
                Storage.updateWeekProject();
            }
        } else {
            Storage.deleteTask(projectName, taskName);
        }
    
        // Apply completion styles
        const taskText = taskButton.children[0].children[1];
        const checkboxIcon = taskButton.children[0].children[0];
        
        taskText.style.textDecoration = "line-through";
        checkboxIcon.style.filter = "invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)"; // This creates a green color
        
        // Add a short delay before removing the task
        setTimeout(() => {
            UI.clearTasks();
            UI.loadTasks(projectName);
        }, 1000); // 1 second delay to show the completion state
    }
    
    

    static closeRenameInput(taskButton) {
        const taskNameElement = taskButton.querySelector('.task-content');
        const taskNameInput = taskButton.querySelector('.input-task-name');
    
        taskNameElement.style.display = 'block';
        taskNameInput.style.display = 'none';
    }

    static closeSetDateInput(taskButton) {
        const dueDate = taskButton.querySelector('.due-date');
        const dueDateInput = taskButton.querySelector('.input-due-date');

        dueDate.style.display = 'block';
        dueDateInput.style.display = 'none';
    }

    static renameTask(e) {
        if (e.key !== 'Enter') return;

        const taskNameInput = e.target;
        const taskButton = taskNameInput.closest('.button-task');
        const taskNameElement = taskButton.querySelector('.task-content');
        const projectName = document.getElementById('project-name').textContent;
        const oldTaskName = taskNameElement.textContent;
        const newTaskName = taskNameInput.value.trim();

        if (!newTaskName) {
            alert("Task name cannot be empty");
            return;
        }

        try {
            const todoList = Storage.getTodoList();
            const project = todoList.getProject(projectName);

            if (!project) {
                throw new Error(`Project "${projectName}" not found`);
            }

            if (project.contains(newTaskName) && newTaskName !== oldTaskName) {
                alert('Task names must be unique within the same project');
                return;
            }

            Storage.renameTask(projectName, oldTaskName, newTaskName);
            taskNameElement.textContent = newTaskName;
            
            UI.closeRenameInput(taskButton);
        } catch (error) {
            console.error('Error renaming task:', error);
            alert('Failed to rename task. Please try again.');
            UI.closeRenameInput(taskButton);
        }
    }

    static openSetDateInput(taskButton) {
        const dueDate = taskButton.querySelector('.due-date');
        const dueDateInput = taskButton.querySelector('.input-due-date');
    
        const currentDateText = dueDate.textContent;
        if (currentDateText && currentDateText !== 'No date') {
            const [day, month, year] = currentDateText.split('/');
            const formattedDate = `${year}-${month}-${day}`;
            dueDateInput.value = formattedDate;
        } else {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            dueDateInput.value = `${year}-${month}-${day}`;
        }
    
        UI.closeAllPopups();
        dueDate.style.display = 'none';
        dueDateInput.style.display = 'block';
        dueDateInput.focus();
    
        dueDateInput.addEventListener('change', UI.setTaskDate);
        dueDateInput.addEventListener('keypress', UI.setTaskDate);
        
        dueDateInput.addEventListener('blur', () => UI.closeSetDateInput(taskButton));
    }

    static setTaskDate(e) {
        if (e.type === 'keypress' && e.key !== 'Enter') return;

        try {
            const taskButton = this.closest('.button-task');
            const projectName = document.getElementById('project-name').textContent;
            const taskName = taskButton.querySelector('.task-content').textContent;
            
            const inputValue = this.value;
            if (!inputValue) return;
            
            const [year, month, day] = inputValue.split('-').map(num => parseInt(num, 10));
            const inputDate = new Date(year, month - 1, day);
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (inputValue.length === 10) {
                if (isNaN(inputDate.getTime()) || inputDate < today) {
                    alert("Please select a valid date today or in the future");
                    return;
                }

                const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

                if (projectName === 'Today' || projectName === 'This week') {
                    const mainProjectName = taskName.split('(')[1].split(')')[0];
                    const mainTaskName = taskName.split(' ')[0];

                    Storage.setTaskDate(projectName, taskName, formattedDate);
                    Storage.setTaskDate(mainProjectName, mainTaskName, formattedDate);

                    if (projectName === 'Today') {
                        Storage.updateTodayProject();
                    } else {
                        Storage.updateWeekProject();
                    }
                } else {
                    Storage.setTaskDate(projectName, taskName, formattedDate);
                }

                UI.clearTasks();
                UI.loadTasks(projectName);
                UI.closeSetDateInput(taskButton);
            }
        } catch (error) {
            console.error('Error setting task date:', error);
            if (inputValue.length === 10) {
                alert('Failed to set task date. Please try again.');
            }
        }
    }
}