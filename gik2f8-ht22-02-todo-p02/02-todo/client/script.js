todoForm.title.addEventListener("keyup", (e) => validateField(e.target));
todoForm.title.addEventListener("blur", (e) => validateField(e.target));
todoForm.description.addEventListener("input", (e) => validateField(e.target));
todoForm.description.addEventListener("blur", (e) => validateField(e.target));

todoForm.dueDate.addEventListener("input", (e) => validateField(e.target));
todoForm.dueDate.addEventListener("blur", (e) => validateField(e.target));

todoForm.addEventListener("submit", onSubmit);

const todoListElement = document.getElementById("todoList");
let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;

const api = new Api("http://localhost:5000/tasks");

function validateField(field) {
  const { name, value } = field;

  let = validationMessage = "";
  switch (name) {
    case "title": {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        titleValid = true;
      }
      break;
    }
    case "description": {
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage =
          "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    case "dueDate": {
      if (value.length === 0) {
        dueDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }

  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove("hidden");
}

function onSubmit(e) {
  e.preventDefault();

  if (titleValid && descriptionValid && dueDateValid) {
    console.log("Submit");

    saveTask();
  }
}

function saveTask() {
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false,
  };

  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
}

function renderList() {
  console.log("rendering");

  api.getAll().then((tasks) => {
    todoListElement.innerHTML = "";

    tasks.sort((sortOne, sortTwo) =>
      sortOne.dueDate < sortTwo.dueDate
        ? 1
        : sortOne.dueDate > sortTwo.dueDate
        ? -1
        : 0
    );

    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        if (task.completed) {
          todoListElement.insertAdjacentHTML("beforeend", renderTask(task));
        } else {
          todoListElement.insertAdjacentHTML("afterbegin", renderTask(task));
        }
      });
    }
  });
}

function renderTask({ id, title, description, dueDate, completed }) {
  const boxcss =
    completed == true
      ? "bg-gradient-to-br from-purple-500 to-yellow-400 rounded-md"
      : "";
  const checkmark = completed == true ? "checked" : "";

  let html = `
  <li class="select-none mt-2 py-2 border-b border-amber-300 ${boxcss}">
  <div class="flex items-center p-1" id=${id}>
    <h3 class="mb-5 flex-1 text-xl font-bold text-cyan-400 uppercase">${title}</h3>
    <div>
      <span>${dueDate}</span>
      <button onclick="deleteTask(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>  
     
      <input onclick="apiUpdate(${id})" type="checkbox" id="checkBox" name="checkBox"${checkmark}>
      <label for="completedBox">Utförd</label>
   
      </div>
  </div>`;

  description &&
    (html += `
      <p class="ml-3 mt-0  text-s italic text-slate-700">${description}</p>
  `);

  html += `
    </li>`;

  return html;
}

function deleteTask(id) {
  api.remove(id).then(() => {
    renderList();
  });
}

function apiUpdate(id) {
  api.update(id);
}

renderList();

/*
PS D:\Repos\Labb 2> cd gik2f8-ht22-02-todo-p02
PS D:\Repos\Labb 2\gik2f8-ht22-02-todo-p02> cd 02-todo/server    
PS D:\Repos\Labb 2\gik2f8-ht22-02-todo-p02\02-todo\server> npm install     
PS D:\Repos\Labb 2\gik2f8-ht22-02-todo-p02\02-todo\server> npm run dev app.js
*/
