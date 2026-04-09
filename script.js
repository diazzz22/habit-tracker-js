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

//function to render expenses but with foreach loop instead of for loop
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

    delHabit.textContent = "Delete";
    delHabit.addEventListener("click", function(event) {
      event.stopPropagation();
      habits.splice(realIndex, 1);
      totalSpan.textContent = habits.length;
      saveHabits();
      renderHabits();
    });

    li.textContent = `Habit: ${habit.name} - ${habit.completed ? "Done" : "Pending"}`;

    if (habit.completed) {
      li.style.textDecoration = "line-through";
      li.style.color = "gray";
    }

    li.dataset.index = realIndex;
    li.appendChild(delHabit);
    habitList.appendChild(li);
  });
}

//function to mark as complete the habit with a click
habitList.addEventListener("click", function(event) {
  const index = event.target.dataset.index;
  if (index !== undefined) {
    habits[index].completed = !habits[index].completed;
    saveHabits();
    renderHabits();
  }
});
// function to update total and print expense with array.
function addHabit () {
  const value = habitInput.value.trim();

  if (value !== "") {
    //habits.push(value);
    habits.push({
      name: value,
      completed: false
    });
    totalSpan.textContent = habits.length;
    saveHabits();
    renderHabits ();
    habitInput.value = "";

  } else {
    alert("Enter a valid habit");
  }
}
//click on Add Habit, call to addHabit function.
addBtn.addEventListener("click", function() {
  addHabit();
});

//click in "Delete all"
deleteBtn.addEventListener("click", function() {
  //clean list   
  habits = [];
  totalSpan.textContent = habits.length;
  saveHabits();
  renderHabits ();
});
//press enter to add a new habit.
habitInput.addEventListener("keydown", function(event) {
  if(event.key === "Enter") {
    addHabit();
  }
});
// function for save habits
function saveHabits () {
  localStorage.setItem("habits",JSON.stringify(habits));
}
//function for load habits
function loadHabits () {
  const savedHabits = localStorage.getItem("habits");
  if (savedHabits !== null) {
    habits = JSON.parse(savedHabits);
    totalSpan.textContent = habits.length;
    renderHabits();
  }
}
//load habits once the page has refreshed
document.addEventListener('DOMContentLoaded', loadHabits);
//filter by pending
pendingBtn.addEventListener("click", function() {
  currentFilter = "pending";
  renderHabits();
});
//filter by all
allBtn.addEventListener("click", function() {
  currentFilter = "all";
  renderHabits();
});
//filter by completed
completedBtn.addEventListener("click", function() {
  currentFilter = "completed";
  renderHabits();
});
