let input = document.getElementById("taskName");
let submit = document.getElementById("addTask");
let tasksContainer = document.querySelector(".tasksContainer");
let completedTasksContainer = document.querySelector(
  ".completedTasksContainer .tasks"
);
let err = document.querySelector(".error");
let completedPar = document.querySelector(".completed span");

let deleteAll = document.querySelector(".deleteAll button");
let tasksNum = document.querySelector(".deleteAll button span");

let arrOfTasks = [];
if (localStorage.getItem("tasks")) {
  arrOfTasks = JSON.parse(localStorage.getItem("tasks"));
}
getFromLocal();

submit.onclick = () => {
  if (input.value !== "") {
    addToArr(input.value);
  }
};

submit.addEventListener("click", () => {
  if (input.value === "") {
    window.event.preventDefault();
    modal.classList.remove("d-none");
    modal.classList.add("d-block");
    overlay.style.top = 0;
  }
});

input.onkeydown = () => {
  if (input.selectionStart === 0 && window.event.code === "Space") {
    window.event.preventDefault();
    err.innerHTML = "You Can't Start Task Name With Spaces";
    setTimeout(() => {
      err.innerHTML = "";
    }, 1000);
  }
};

tasksContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    let controls = e.target.parentElement;
    controls.parentElement.remove();
    deleteTaskWith(controls.parentElement.getAttribute("data-id"));
  }

  if (e.target.classList.contains("done")) {
    let controls = e.target.parentElement;
    toggleStatus(controls.parentElement.getAttribute("data-id"));
    controls.parentElement.classList.toggle("done");
  }
});

completedTasksContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    let controls = e.target.parentElement;
    controls.parentElement.remove();
    deleteTaskWith(controls.parentElement.getAttribute("data-id"));
  }

  if (e.target.classList.contains("done")) {
    let controls = e.target.parentElement;
    toggleStatus(controls.parentElement.getAttribute("data-id"));
    controls.parentElement.classList.toggle("done");
  }
});

// Add Task To Array Then Add To Local Storage
function addToArr(taskText) {
  let hours24 = new Date();
  let date = hours24.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Task Data
  const taskObj = {
    id: Date.now(),
    name: taskText,
    date: date,
    completed: false,
  };
  arrOfTasks.push(taskObj);
  showTasks(arrOfTasks);
  addToLocalStorage(arrOfTasks);
}

// Show Tasks In Page
function showTasks(arrOfTasks) {
  tasksContainer.innerHTML = "";
  arrOfTasks.forEach((task) => {
    if (!task.completed) {
      let taskDiv = document.createElement("div");
      taskDiv.className = "task";
      taskDiv.setAttribute("data-id", task.id);
      // Check If Task Is Done
      if (task.completed) {
        taskDiv.className = "task done";
      }
      let taskInfo = taskDiv.appendChild(document.createElement("div"));
      taskInfo.className = "info";

      let taskName = taskInfo.appendChild(document.createElement("p"));
      taskName.className = "name";
      taskName.appendChild(document.createTextNode(task.name));

      let taskDate = taskInfo.appendChild(document.createElement("p"));
      taskDate.className = "date";
      taskDate.appendChild(document.createTextNode(task.date));

      let controls = taskDiv.appendChild(document.createElement("div"));
      controls.className = "controls";

      let doneBtn = controls.appendChild(document.createElement("button"));
      doneBtn.className = "done";
      doneBtn.appendChild(document.createTextNode("Done"));

      let deleteBtn = controls.appendChild(document.createElement("button"));
      deleteBtn.className = "delete";
      deleteBtn.appendChild(document.createTextNode("Delete"));

      tasksContainer.appendChild(taskDiv);
    }
  });
}

// Add Data To LocalStorage
function addToLocalStorage(arrOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrOfTasks));
}

// Fetch Data From LocalStorage
function getFromLocal() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    showTasks(tasks);
  }
}

// Delete Task From Local Storage And Page
function deleteTaskWith(id) {
  arrOfTasks = arrOfTasks.filter((task) => task.id != id);
  addToLocalStorage(arrOfTasks);
  location.reload();
}

// Toggle Status To Done or Not
function toggleStatus(id) {
  for (let i = 0; i < arrOfTasks.length; i++) {
    if (arrOfTasks[i].id == id) {
      arrOfTasks[i].completed == false
        ? (arrOfTasks[i].completed = true)
        : (arrOfTasks[i].completed = false);
      location.reload();
    }
  }
  addToLocalStorage(arrOfTasks);
}

let completedTasks = 0;
let numberOfTasks = [];
arrOfTasks.forEach((task) => {
  if (task.completed) {
    // Change Number To number ot the tasks that completed
    ++completedTasks;
    completedPar.innerHTML = completedTasks;
  }
  // Add Number Of Tasks To Delete All Button
  numberOfTasks.push(task);
  tasksNum.innerHTML = numberOfTasks.length;
});

arrOfTasks.forEach((task) => {
  if (task.completed) {
    let taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.setAttribute("data-id", task.id);
    // Check If Task Is Done
    if (task.completed) {
      taskDiv.className = "task done";
    }
    let taskInfo = taskDiv.appendChild(document.createElement("div"));
    taskInfo.className = "info";

    let taskName = taskInfo.appendChild(document.createElement("p"));
    taskName.className = "name";
    taskName.appendChild(document.createTextNode(task.name));

    let taskDate = taskInfo.appendChild(document.createElement("p"));
    taskDate.className = "date";
    taskDate.appendChild(document.createTextNode(task.date));

    let controls = taskDiv.appendChild(document.createElement("div"));
    controls.className = "controls";

    let doneBtn = controls.appendChild(document.createElement("button"));
    doneBtn.className = "done";
    doneBtn.appendChild(document.createTextNode("Done"));

    let deleteBtn = controls.appendChild(document.createElement("button"));
    deleteBtn.className = "delete";
    deleteBtn.appendChild(document.createTextNode("Delete"));

    completedTasksContainer.appendChild(taskDiv);
  }
});

deleteAll.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

// Modal Card
let modal = document.querySelector(".modal");
let headerBtn = document.querySelector(".closeModalHeaderBtn");
let footerBtn = document.querySelector(".closeModalFooterBtn");
let overlay = document.querySelector(".overlay");

let modalId = modal.dataset.modal;
const hideModal = () => {
  modal.classList.remove("d-block");
  modal.classList.add("d-none");
};
let overlayId = overlay.dataset.id;
if (overlayId === modalId) {
  overlay.addEventListener("click", () => {
    hideModal();
    overlay.style.top = "-100%";
  });
}
let headerBtnId = headerBtn.dataset.btn;
if (modalId === headerBtnId) {
  headerBtn.addEventListener("click", () => {
    hideModal();
    overlay.style.top = "-100%";
  });
}
let footerBtnId = footerBtn.dataset.btn;
if (modalId === footerBtnId) {
  footerBtn.addEventListener("click", () => {
    hideModal();
    overlay.style.top = "-100%";
  });
}
