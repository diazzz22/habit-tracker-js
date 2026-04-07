let habits = [];

const habitInput = document.getElementById("habitInput");
const addBtn = document.getElementById("addBtn");
const totalSpan = document.getElementById("total");
const habitList = document.getElementById("habitList");
const deleteBtn = document.getElementById("deleteBtn");

//function to render expenses but with foreach loop instead of for loop
function renderHabits () {
  habitList.innerHTML = "";

  habits.forEach(function(habit, index) {
    const li = document.createElement("li");
    //logic of delete button
    const delHabit = document.createElement("button");
    delHabit.textContent = "Delete";
    delHabit.addEventListener("click", function(event) {      
      event.stopPropagation();
      habits.splice(index,1);
      totalSpan.textContent = habits.length;
      saveHabits();
      renderHabits();
    });
    //text of <li>
    li.textContent = `Habit: ${habit.name} - ${habit.completed ? "Done" : "Pending"}`;
    //mark complete habit.
    if (habit.completed) {
      li.style.textDecoration = "line-through";
      li.style.color = "gray";
    }

    li.dataset.index = index;
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
    totalSpan.textContent = habits.lenght;
    renderHabits();
  }
}
//load habits once the page has refreshed
document.addEventListener('DOMContentLoaded', loadHabits);