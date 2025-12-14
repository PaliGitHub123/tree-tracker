const createHabitButton = document.getElementById("create-habit");
const habitList = document.getElementById("habits");
const habitListChild = document.getElementById("habit");
const tree = document.getElementById("tree");

let treeWidth = "20px"
let treeHeight = "100px"
let treeBGColor = "green";

tree.style.width = treeWidth;
tree.style.height = treeHeight;
tree.style.backgroundColor = treeBGColor;

createHabitButton.addEventListener("click", createHabit);

function createHabit(){
    let newHabit = document.createElement(habitListChild)
    habitList.insertAdjacentElement(newHabit);
}