// Importing the CSS file
import '../CSS/styles.css';
import UI from './modules/UI';

// Importing images
import calendarToday from '../img/calendar-today.svg';
import calendarWeek from '../img/calendar-week.svg';
import inboxIcon from '../img/inbox.svg';
import plusBox from '../img/plus-box.svg';
import checkboxIcon from '../img/checkbox.svg';
import deleteIcon from '../img/delete.svg';
import projectIcon from '../img/project.svg';
import addTaskIcon from '../img/add-task.svg';

// Function to initialize images
const initializeImages = () => {
    // Default project icons
    const todayIcon = document.getElementById('calendar-today');
    const weekIcon = document.getElementById('calendar-week');
    const inboxIconElement = document.getElementById('inbox');
    const plusBoxIcon = document.getElementById('plus-box');

    // Set default project icons
    if (todayIcon) todayIcon.src = calendarToday;
    if (weekIcon) weekIcon.src = calendarWeek;
    if (inboxIconElement) inboxIconElement.src = inboxIcon;
    if (plusBoxIcon) plusBoxIcon.src = plusBox;

    // Set up image sources for dynamically created elements
    // Store these in CSS as background images or in a global object for UI.js to use
    document.documentElement.style.setProperty('--checkbox-icon', `url(${checkboxIcon})`);
    document.documentElement.style.setProperty('--delete-icon', `url(${deleteIcon})`);
    document.documentElement.style.setProperty('--project-icon', `url(${projectIcon})`);
    document.documentElement.style.setProperty('--add-task-icon', `url(${addTaskIcon})`);
};

// When the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeImages();
    UI.loadHomepage();
});