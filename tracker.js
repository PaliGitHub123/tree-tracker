//buttons
const createHabitButton = document.getElementById("create-habit");
const checkHabitButton = document.getElementById("check-habit");
const deleteHabitButton = document.getElementById("delete-habit");

//habit tracker
const habitList = document.getElementById("habits");
const input = document.getElementById("input-field");
let habitsCounter = 0;
//let checkedHabits = 0;
//let habitMultiplier = 1/6;

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
        saveData();
    }catch (exception){
        throw(exception);
    }
}

habitList.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        if(!e.target.classList.contains("checked")){
            e.target.classList.toggle("checked");
            //checkedHabits++;
            //e.target.id = "list" + checkedHabits;
            calculateTree();
            //console.log(e.target);
            saveData();
        }else{
            e.target.removeAttribute("class");
            calculateTree(true);
            e.target.id = "";
            saveData();
        }
    }
    
    if(e.target.id === "delete"){
        habitsCounter--;

        if(e.target.parentElement.classList.contains("checked")){
           // checkedHabits--;
           calculateTree(true);
        }
        

        e.target.parentElement.remove();
        saveData();
    }
}, false);

function calculateTree (isDelete){

    try{

        if(habitsCounter === 0){
            treeWidth = 10;
            treeHeight = 50;
        }else{
            //console.log("multip: " + habitMultiplier);
            if(isDelete){
                treeWidth = treeWidth - 3;
                treeHeight = treeHeight - 3;
            }else{
                treeWidth = 3 + treeWidth;
                treeHeight = 3 + treeHeight;
        }
        }
        
        tree.style.width = treeWidth + "px";
        tree.style.height = treeHeight + "px";

       saveTreeData();
        //console.log(treeWidth, treeHeight, habitsCounter);
    }catch(exception){
        throw(exception);
    }
}

function saveData(){
    localStorage.setItem("data", habitList.innerHTML);
}

function saveTreeData(){
    localStorage.setItem("tree-width", tree.style.width);
    localStorage.setItem("tree-height", tree.style.height);
}

function showData(){
    habitList.innerHTML = localStorage.getItem("data");
    tree.style.width = localStorage.getItem("tree-width");
    tree.style.height = localStorage.getItem("tree-height");
    console.log(treeWidth);
}
showData();