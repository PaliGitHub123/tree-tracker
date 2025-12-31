//buttons
const createHabitButton = document.getElementById("create-habit");
const checkHabitButton = document.getElementById("check-habit");
const deleteHabitButton = document.getElementById("delete-habit");
const clearLocalStorageButton = document.getElementById("clear-local-storage");
const mobileLocalStorageInfo = document.getElementById("mobile-clear-local-storage-text");

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
const treeGrowth = 4.5;

tree.style.width = treeWidth + "px";
tree.style.height = treeHeight + "px";
tree.style.backgroundColor = treeBGColor;

createHabitButton.addEventListener("click", createHabit);

clearLocalStorageButton.addEventListener("click", function(){
    localStorage.clear();
});

mobileLocalStorageInfo.addEventListener("click", function(){
    if(window.confirm('Deletes all the data from the Habit Garden. You have to reload after confirming!')){
        localStorage.clear();
    };
    
})

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
           /*console.log("case check");
           console.log(tree.style.height);
           console.log(tree.style.width);*/

           calculateTree(true);
        }
        

        e.target.parentElement.remove();
        saveData();
    }
}, false);

input.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        createHabit();
    }
});

function calculateTree (isDelete){

    try{

        if(habitsCounter === 0){
            treeWidth = 10;
            treeHeight = 50;
        }else{
            //console.log("multip: " + habitMultiplier);
            if(isDelete){
                treeWidth = treeWidth - treeGrowth;
                treeHeight = treeHeight - treeGrowth;
            }else{
                treeWidth = treeGrowth + treeWidth;
                treeHeight = treeGrowth + treeHeight;
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
    localStorage.setItem("habitsCounter", habitsCounter);
}

function saveTreeData(){
    localStorage.setItem("tree-width", tree.style.width);
    localStorage.setItem("tree-height", tree.style.height);
}

function showData(){
    habitList.innerHTML = localStorage.getItem("data");
    tree.style.width = localStorage.getItem("tree-width");
    tree.style.height = localStorage.getItem("tree-height");
    habitsCounter = Number(localStorage.getItem("habitsCounter")) || 0;

    treeWidth = parseFloat(localStorage.getItem("tree-width")) || 10;
    treeHeight = parseFloat(localStorage.getItem("tree-height")) || 50;
    //console.log(treeWidth);
}
showData();

let habitListChildren = new Array(habitList.children);


function checkAndResetDaily(){
    const lastResetDate = localStorage.getItem("last-reset-date");
    const today = new Date().toDateString();
    
    if(lastResetDate !== today){
        // Neuer Tag - reset alle habits
        Array.from(habitList.children).forEach(element => {
            element.classList.remove("checked");
        });
        localStorage.setItem("last-reset-date", today);
        saveData();
    }
}

showData();
checkAndResetDaily(); // Nach dem Laden prüfen