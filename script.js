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
  updateSummary();

  let filteredHabits = habits;
  const last30Days = getLast30Days();
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
  if (filteredHabits.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No habits yet";
    habitList.appendChild(li);
    return;
  }
  filteredHabits.forEach(function(habit) {
    const realIndex = habits.indexOf(habit);

    const li = document.createElement("li");
    const toggleHabit = document.createElement("button");
    const delHabit = document.createElement("button");
    const editHabit = document.createElement("button");
//toggleHabit logic
    toggleHabit.classList.add("toggle-habit");
    toggleHabit.innerHTML = isCompletedToday(habit) ? "&check;" : "";
    if (isCompletedToday(habit)) {
      toggleHabit.classList.add("completed-toggle");
    }
    li.appendChild(toggleHabit);
    toggleHabit.addEventListener("click", function(event) {
      event.stopPropagation();

      const today = getTodayString();

      if (habits[realIndex].completedDates.includes(today)) {
        habits[realIndex].completedDates = habits[realIndex].completedDates.filter(function(date) {
        return date !== today;
      });
      } else {
        habits[realIndex].completedDates.push(today);
      }

  habits[realIndex].streak = calculateStreak(habits[realIndex]);
  saveHabits();
  renderHabits();
});
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
        if (event.key === "Escape") {
          habits[realIndex].editing = false;
          renderHabits();
        }
      });
      
      cancelButton.addEventListener("click", function(event) {
        event.stopPropagation();
        habits[realIndex].editing = false;
        renderHabits();
      });
//display habit
    } else {
      const habitContent = document.createElement("div");
      const heatmap = document.createElement("div");
      const textSpan = document.createElement("span");
      const status = isCompletedToday(habit) ? "Done today" : "Pending today";

      habitContent.classList.add("habit-content");
      heatmap.classList.add("heatmap");
      textSpan.textContent = `Habit: ${habit.name} - ${status} - Streak: ${habit.streak}`;

      if (isCompletedToday(habit)) {
        textSpan.style.textDecoration = "line-through";
        textSpan.style.color = "gray";
      }

      last30Days.forEach(function(date) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("heatmap-day");

        if (habit.completedDates.includes(date)) {
          dayCell.classList.add("completed-day");
        }

        if (date === getTodayString()) {
          dayCell.classList.add("today");
        }

        dayCell.title = date;
        heatmap.appendChild(dayCell);
      });

      habitContent.appendChild(textSpan);
      habitContent.appendChild(heatmap);
      li.appendChild(habitContent);
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


//function to create a new habit
function addHabit() {
  const value = habitInput.value.trim();

  if (value !== "") {
    habits.push({
      name: value,
      completedDates: [],
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
      const normalizedHabit = {
        name: habit.name,
        completedDates: habit.completedDates || (habit.lastCompletedDate ? [habit.lastCompletedDate] : []),
        streak: 0,
        editing: habit.editing || false
  };

  normalizedHabit.streak = calculateStreak(normalizedHabit);
  return normalizedHabit;
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
  return habit.completedDates.includes(getTodayString());
}

//function to know what day was 
function getDateStringDaysAgo(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

//function to calculate the total number of habits completed  today
function updateSummary () {
  const completedToday = habits.filter(isCompletedToday).length;
  const totalHabits = habits.length;
  totalSpan.textContent = `${completedToday}/${totalHabits}`;
}

function getLast30Days() {
  const days = [];

  for (let daysAgo = 29; daysAgo >= 0; daysAgo -= 1) {
    days.push(getDateStringDaysAgo(daysAgo));
  }

  return days;
}

//function to calculate streak
function calculateStreak (habit) {
  const today = getTodayString();
  const yesterday = getDateStringDaysAgo(1);
  
  let streak = 0;
  let daysAgo = 0;

  if (!habit.completedDates.includes(today)) {
    if (!habit.completedDates.includes(yesterday)){
      return 0;
    }
    daysAgo = 1;
  }

  while (true) {
    const dateToCheck = getDateStringDaysAgo(daysAgo);

    if (habit.completedDates.includes(dateToCheck)) {
      streak += 1;
      daysAgo += 1;
    } else {
      break;
    }
  }
  return streak;
}
