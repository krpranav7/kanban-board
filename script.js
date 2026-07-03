const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
let dragElement = null;
const columns = [todo, progress, done]

let tasksData = {};

const task = document.querySelectorAll('.task');

const toggleModalButton = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal .bg");

const addTaskButton = document.querySelector("#add-new-task");

function addTask(title, desc, column) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");
    div.innerHTML = `<h2>${title}</h2>
                    <p>${desc}</p>
                    <button>Delete</button>`;
    column.appendChild(div);

    div.addEventListener("drag", (e) => {
        dragElement = div;
    })

    const deleteButton = div.querySelector("button");
    deleteButton.addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    })

    return div;
}

function updateTaskCount() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");
        count.innerText = tasks.length;

        tasksData[col.id] = Array.from(tasks).map(t => {
            return {
                title: t.querySelector("h2").innerText,
                desc: t.querySelector("p").innerText
            }
        })

        localStorage.setItem("tasks", JSON.stringify(tasksData));
    });
}

if (localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"));

    for (const col in data) {
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => {
            addTask(task.title, task.desc, column)
        })

        updateTaskCount();
    }
}

task.forEach(task => {
    task.addEventListener("drag", (e) => {
        dragElement = task;
    })
})

function addDragEventsOnColumn(column) {
    let counter = 0;
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        counter++;
        column.classList.add("hover-over");
    })
    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        counter--;
        if (counter === 0) {
            column.classList.remove("hover-over");
        }
    })

    column.addEventListener("dragover", (e) => {
        e.preventDefault(); 
    })
    column.addEventListener("drop", (e) => {
        e.preventDefault(); 

        column.appendChild(dragElement); 
        counter = 0;
        column.classList.remove("hover-over");

        updateTaskCount();

    })
}
addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

// modal related logic
toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
})
modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
})

addTaskButton.addEventListener("click", () => {
    const taskTitle = document.querySelector("#task-title-input").value;
    const taskDesc = document.querySelector("#task-desc-input").value;

    addTask(taskTitle, taskDesc, todo);

    updateTaskCount();

    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-desc-input").value = "";

    modal.classList.remove("active");
})