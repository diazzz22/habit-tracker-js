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

//function to render the habits
function renderHabits() {
  habitList.innerHTML = "";
  updateFilterButtons();

  let filteredHabits = habits;
//pending
  if (currentFilter === "pending") {
    filteredHabits = habits.filter(function(habit) {
      return !isCompletedToday(habit);
    });
  }
//completed
  if (currentFilter === "completed") {
    filteredHabits = habits.filter(function(habit) {
      return isCompletedToday(habit);
    });
  }

  filteredHabits.forEach(function(habit) {
    const realIndex = habits.indexOf(habit);

    const li = document.createElement("li");
    const delHabit = document.createElement("button");
    const editHabit = document.createElement("button");
//Actions buttons in the list
    const actions = document.createElement("div");
    actions.classList.add ("habit-actions");

    actions.appendChild(delHabit);
    actions.appendChild(editHabit);
//Define text content for the actions.
    delHabit.textContent = "Delete";
    editHabit.textContent = "Edit";
    editHabit.classList.add ("edit-btn");
//logic of edit habit
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
      //cancel button
      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      li.appendChild(cancelButton);

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
      
      cancelButton.addEventListener("click", function(event) {
        event.stopPropagation();
        habits[realIndex].editing = false;
        renderHabits();
      });
//display habit
    } else {
      const textSpan = document.createElement("span");
      const status = isCompletedToday(habit) ? "Done today" : "Pending today";
      textSpan.textContent = `Habit: ${habit.name} - ${status} - Streak: ${habit.streak}`;
//css of mark as completed.
      if (isCompletedToday(habit)) {
        textSpan.style.textDecoration = "line-through";
        textSpan.style.color = "gray";
      }

      li.appendChild(textSpan);
    }
//Delete the selected habit button 
    delHabit.addEventListener("click", function(event) {
      event.stopPropagation();
      habits.splice(realIndex, 1);
      totalSpan.textContent = habits.length;
      saveHabits();
      renderHabits();
    });

    li.dataset.index = realIndex;
    li.appendChild(actions);
    habitList.appendChild(li);
  });
}

//mark as completed with a click
habitList.addEventListener("click", function(event) {
  if (event.target.tagName === "BUTTON" || event.target.tagName === "INPUT") {
    return;
  }

  const li = event.target.closest("li");
  if (!li) return;

  const index = li.dataset.index;

  if (index !== undefined) {
    const today = getTodayString();
    const yesterday = getDateStringDaysAgo(1);

    if (habits[index].lastCompletedDate === today) {
      habits[index].lastCompletedDate = null;
      habits[index].streak = 0;
    } else {
      if (habits[index].lastCompletedDate === yesterday) {
        habits[index].streak += 1;
      } else {
        habits[index].streak = 1;
      }
  
    habits[index].lastCompletedDate = today;
}
    saveHabits();
    renderHabits();
  }
});
//function to create a new habit
function addHabit() {
  const value = habitInput.value.trim();

  if (value !== "") {
    habits.push({
      name: value,
      lastCompletedDate: null,
      streak: 0,
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
//button to add new habit.
addBtn.addEventListener("click", function() {
  addHabit();
});
//button to delete all habits.
deleteBtn.addEventListener("click", function() {
  habits = [];
  totalSpan.textContent = habits.length;
  saveHabits();
  renderHabits();
});
//press enter to add a new habit.
habitInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addHabit();
  }
});
//save the current habits
function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}
//load the current habits.
function loadHabits() {
  const savedHabits = localStorage.getItem("habits");

  if (savedHabits !== null) {
    habits = JSON.parse(savedHabits).map(function(habit) {
    return {
      name: habit.name,
     lastCompletedDate: habit.lastCompletedDate || null,
     streak: habit.streak || 0,
     editing: habit.editing || false
    };
    });
  }
  totalSpan.textContent = habits.length;
  renderHabits();
}

document.addEventListener("DOMContentLoaded", loadHabits);

//button of status filter. Pending
pendingBtn.addEventListener("click", function() {
  currentFilter = "pending";
  renderHabits();
});

//button of status filter. All
allBtn.addEventListener("click", function() {
  currentFilter = "all";
  renderHabits();
});

//button of status filter. Completed.
completedBtn.addEventListener("click", function() {
  currentFilter = "completed";
  renderHabits();
});

//function to highlight the active filter.
function updateFilterButtons(){
  allBtn.classList.remove("active-filter");
  completedBtn.classList.remove("active-filter");
  pendingBtn.classList.remove("active-filter");
  if (currentFilter === "all") {
    allBtn.classList.add("active-filter");
  } if (currentFilter === "completed") {
    completedBtn.classList.add("active-filter");
  } if (currentFilter === "pending") {
    pendingBtn.classList.add("active-filter");
  } 
}
//function to get today's date
function getTodayString () {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

//function to check if a habit is completed today
function isCompletedToday (habit) {
  return habit.lastCompletedDate === getTodayString();
}

//function to know what day was 
function getDateStringDaysAgo (daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
}