let habits = [];
let currentFilter = "all";

const habitInput = document.getElementById("habitInput");
const addBtn = document.getElementById("addBtn");
const totalSpan = document.getElementById("total");
const habitList = document.getElementById("habitList");
const deleteBtn = document.getElementById("deleteBtn");
const allBtn = document.getElementById("allBtn");
const pendingBtn = document.getElementById("pendingBtn");
const completedBtn = document.getElementById("completedBtn");

function renderHabits() {
  habitList.innerHTML = "";
  let filteredHabits = habits;

  if (currentFilter === "pending") {
    filteredHabits = habits.filter(function(habit) {
      return habit.completed === false;
    });
  }

  if (currentFilter === "completed") {
    filteredHabits = habits.filter(function(habit) {
      return habit.completed === true;
    });
  }

  filteredHabits.forEach(function(habit) {
    const realIndex = habits.indexOf(habit);

    const li = document.createElement("li");
    const delHabit = document.createElement("button");
    const editHabit = document.createElement("button");

    delHabit.textContent = "Delete";
    editHabit.textContent = "Edit";

    editHabit.addEventListener("click", function(event) {
      event.stopPropagation();

      habits.forEach(function(h) {
        h.editing = false;
      });

      habits[realIndex].editing = true;
      saveHabits();
      renderHabits();
    });

    if (habit.editing) {
      const editInput = document.createElement("input");
      editInput.value = habit.name;
      li.appendChild(editInput);

      editInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          const newValue = editInput.value.trim();

          if (newValue !== "") {
            habits[realIndex].name = newValue;
            habits[realIndex].editing = false;
            saveHabits();
            renderHabits();
          }
        }
      });
    } else {
      const textSpan = document.createElement("span");
      textSpan.textContent = `Habit: ${habit.name} - ${habit.completed ? "Done" : "Pending"}`;

      if (habit.completed) {
        textSpan.style.textDecoration = "line-through";
        textSpan.style.color = "gray";
      }

      li.appendChild(textSpan);
    }

    delHabit.addEventListener("click", function(event) {
      event.stopPropagation();
      habits.splice(realIndex, 1);
      totalSpan.textContent = habits.length;
      saveHabits();
      renderHabits();
    });

    li.dataset.index = realIndex;
    li.appendChild(delHabit);
    li.appendChild(editHabit);
    habitList.appendChild(li);
  });
}

habitList.addEventListener("click", function(event) {
  if (event.target.tagName === "BUTTON" || event.target.tagName === "INPUT") {
    return;
  }

  const li = event.target.closest("li");
  if (!li) return;

  const index = li.dataset.index;

  if (index !== undefined) {
    habits[index].completed = !habits[index].completed;
    saveHabits();
    renderHabits();
  }
});

function addHabit() {
  const value = habitInput.value.trim();

  if (value !== "") {
    habits.push({
      name: value,
      completed: false,
      editing: false
    });

    totalSpan.textContent = habits.length;
    saveHabits();
    renderHabits();
    habitInput.value = "";
  } else {
    alert("Enter a valid habit");
  }
}

addBtn.addEventListener("click", function() {
  addHabit();
});

deleteBtn.addEventListener("click", function() {
  habits = [];
  totalSpan.textContent = habits.length;
  saveHabits();
  renderHabits();
});

habitInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addHabit();
  }
});

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function loadHabits() {
  const savedHabits = localStorage.getItem("habits");

  if (savedHabits !== null) {
    habits = JSON.parse(savedHabits);
    totalSpan.textContent = habits.length;
    renderHabits();
  }
}

document.addEventListener("DOMContentLoaded", loadHabits);

pendingBtn.addEventListener("click", function() {
  currentFilter = "pending";
  renderHabits();
});

allBtn.addEventListener("click", function() {
  currentFilter = "all";
  renderHabits();
});

completedBtn.addEventListener("click", function() {
  currentFilter = "completed";
  renderHabits();
});