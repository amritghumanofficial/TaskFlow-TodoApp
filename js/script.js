// DOM Element Selectors
const todoInput = document.getElementById("todoInput");
const todoStatusSelect = document.getElementById("todoStatusSelect");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todoList");
const darkModeBtn = document.getElementById("darkModeBtn");
const body = document.body;

// Stats Elements
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const progressCount = document.getElementById("progressCount");
const completedCount = document.getElementById("completedCount");
const clearAllBtn = document.getElementById("clearAllBtn");

/* --- Track Edit State --- */
let editIndex = -1; 

/* --- Dark Mode System --- */
const currentTheme = localStorage.getItem("theme") || "light";

if (currentTheme === "dark") {
    body.classList.add("dark-mode");
    darkModeBtn.checked = true;
}

darkModeBtn.addEventListener("change", () => {
    if (darkModeBtn.checked) {
        body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    } else {
        body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }
});

/* --- Todo Core Logic --- */
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Function to update the Task Counters
function updateStats() {
    totalCount.innerText = todos.length;
    pendingCount.innerText = todos.filter(t => t.status === "Pending").length;
    progressCount.innerText = todos.filter(t => t.status === "In Progress").length;
    completedCount.innerText = todos.filter(t => t.status === "Completed").length;
}

// Render List Function
function renderTodo() {
    todoList.innerHTML = "";
    if (todos.length === 0) {
        todoList.innerHTML = `<p class="empty-msg">🎉 No tasks left! Enjoy your day.</p>`;
        updateStats();
        localStorage.setItem("todos", JSON.stringify(todos));
        return;
    }

    todos.forEach((todo, index) => {
        const li = document.createElement("li");
        
        const statusClass = todo.status.toLowerCase().replace(" ", "-");
        li.className = `todo-item ${statusClass}`;

        li.innerHTML = `
            <div class="task-details">
                <span class="task-text">${todo.text}</span>
                <span class="status-badge ${statusClass}">${todo.status}</span>
            </div>
            <div class="action-buttons">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">❌</button>
            </div>
        `;

        // Task text click toggles status cycles: Pending -> In Progress -> Completed -> Pending
        li.querySelector(".task-text").addEventListener("click", () => {
            cycleStatus(index);
        });

        // Edit button click event
        li.querySelector(".edit-btn").addEventListener("click", () => {
            editTask(index);
        });

        // Delete button click event with transition
        li.querySelector(".delete-btn").addEventListener('click', () => {
            li.classList.add("delete-animation");
            li.addEventListener('transitionend', () => {
                deleteTask(index);
            }, { once: true });
        });

        todoList.appendChild(li);
    });

    updateStats();
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Add or Update Items
function handleTodoAction() {
    const taskText = todoInput.value.trim();
    const taskStatus = todoStatusSelect.value;

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    if (editIndex === -1) {

        todos.push({
            text: taskText,
            status: taskStatus
        });
    } else {
        // Edit Mode
        todos[editIndex].text = taskText;
        todos[editIndex].status = taskStatus;
        
        editIndex = -1; 
        addTodoBtn.innerText = "Add Task"; 
    }

    todoInput.value = "";
    todoStatusSelect.value = "Pending"; 
    renderTodo();
}

// Cycle status on clicking task text (Pending -> In Progress -> Completed)
function cycleStatus(index) {
    const currentStatus = todos[index].status;
    if (currentStatus === "Pending") {
        todos[index].status = "In Progress";
    } else if (currentStatus === "In Progress") {
        todos[index].status = "Completed";
    } else {
        todos[index].status = "Pending";
    }
    renderTodo();
}

/* --- Edit Task Function --- */
function editTask(index) {
    editIndex = index;
    todoInput.value = todos[index].text;
    todoStatusSelect.value = todos[index].status; 
    addTodoBtn.innerText = "Save";
    todoInput.focus();
}

// Delete Task
function deleteTask(index) {
    if (editIndex === index) {
        editIndex = -1;
        todoInput.value = "";
        todoStatusSelect.value = "Pending";
        addTodoBtn.innerText = "Add Task";
    }
    
    todos.splice(index, 1);
    renderTodo();
}

/* --- Clear All Logic --- */
clearAllBtn.addEventListener("click", () => {
    if (todos.length > 0 && confirm("Are you sure you want to delete all tasks?")) {
        todos = [];
        renderTodo();
    }
});

/* --- Event Handlers --- */
addTodoBtn.addEventListener("click", handleTodoAction);

todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleTodoAction();
    }
});



if (todos.length === 0 && !localStorage.getItem("hasLoadedOnce")) {
    const dummyTodos = [
        { text: "Design modern UI layout for Login Screen", status: "Completed" },
        { text: "Review client critical feedback on Project Dashboard", status: "In Progress" },
        { text: "Prepare weekly presentation slides for Friday meet", status: "Pending" },
        { text: "Buy monthly groceries: Milk, organic eggs, and coffee beans", status: "Pending" },
        { text: "Evening high-intensity gym workout - Leg Day", status: "In Progress" },
        { text: "Complete advanced React Navigation masterclass tutorial", status: "Completed" },
        { text: "Practice 2 coding challenges on LeetCode (Medium)", status: "Pending" },
        { text: "Fix responsive layout bugs on mobile viewports", status: "In Progress" },
        { text: "Schedule car service appointment for weekend", status: "Pending" },
        { text: "Water the balcony plants and cleanup setup", status: "Completed" }
    ];
    
    todos = dummyTodos;
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("hasLoadedOnce", "true"); 
}
renderTodo();
