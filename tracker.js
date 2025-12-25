//buttons
const createHabitButton = document.getElementById("create-habit");
const checkHabitButton = document.getElementById("check-habit");
const deleteHabitButton = document.getElementById("delete-habit");

//habit tracker
const habitList = document.getElementById("habits");
const input = document.getElementById("input-field");
let habitsCounter = 0;
let checkedHabits = 0;
let habitMultiplier = 1/6;

let exception;

//tree
const tree = document.getElementById("tree");

let treeWidth = 10
let treeHeight = 50
let treeBGColor = "green";

tree.style.width = treeWidth + "px";
tree.style.height = treeHeight + "px";
tree.style.backgroundColor = treeBGColor;

createHabitButton.addEventListener("click", createHabit);

function createHabit(){
    if(input.value == ''){ 
        exception = "Missing input value";
        throw exception;
    }

    if(habitsCounter === 8){
        exception = "Maximum amount of habits reached";
        throw exception;
    }

    try{
        //list
        let li = document.createElement("li");

        //delete button
        let delButton = document.createElement("button");
        delButton.innerText = "Delete";
        delButton.id = "delete";

        li.innerHTML = input.value;
        habitList.appendChild(li);
        li.appendChild(delButton);
        habitsCounter++;
        input.value ="";
    }catch (exception){
        throw(exception);
    }
}

habitList.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        if(!e.target.classList.contains("checked")){
            e.target.classList.toggle("checked");
            checkedHabits++;
            e.target.id = "list" + checkedHabits;
            calculateTree();
            console.log(e.target);
        }
    }
    
    if(e.target.id === "delete"){
        habitsCounter--;

        if(e.target.parentElement.classList.contains("checked")){
            checkedHabits--;
        }
        calculateTree(true);

        e.target.parentElement.remove();
    }
}, false);

function calculateTree (isDelete){
    console.log(checkedHabits, habitsCounter);
    if(checkedHabits > habitsCounter){
        exception = "All habits checked";
        throw(exception);
    }

    try{

        console.log("multip: " + habitMultiplier);
        if(isDelete){
            if(habitsCounter <= 2){
                treeHeight = 50;
                treeWidth = 10;
            }else{
                treeWidth = treeWidth - (treeWidth*habitMultiplier);
                treeHeight = treeHeight - (treeHeight*habitMultiplier);
                console.log(treeWidth, treeHeight);
            }
        }else{
            treeWidth = (treeWidth*habitMultiplier) + treeWidth;
            treeHeight = (treeHeight*habitMultiplier) + treeHeight;
        }
        tree.style.width = treeWidth + "px";
        tree.style.height = treeHeight + "px";
    }catch(exception){
        throw(exception);
    }
}