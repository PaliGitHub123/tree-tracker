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
let checkedHabits = 0;

let exception;
let dblClickState = false;

//tree
const tree = document.getElementById("tree");

let treeWidth = 5
let treeHeight = 10

let MAXtreeWidth = 45;
let MAXtreeHeight = 93;

let treeBGColor = "green";

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
        throw new Error(exception);
    }

    if(habitsCounter === 8){
        exception = "Maximum amount of habits reached";
        throw new Error(exception);
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
        throw new Error(exception);
    }
}

habitList.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        if(!e.target.classList.contains("checked")){
            e.target.classList.toggle("checked");
            checkedHabits++;
            e.target.id = "list" + checkedHabits;
            calculateTree();
            //console.log(e.target);
            saveData();
        }else{
            e.target.removeAttribute("class");
            checkedHabits--;
            calculateTree(true);
            e.target.id = "";
            saveData();
        }
    }
    
    if(e.target.id === "delete"){
        habitsCounter--;

        if(e.target.parentElement.classList.contains("checked")){
            checkedHabits--;
           /*console.log("case check");
           console.log(tree.style.height);
           console.log(tree.style.width);*/
            saveData();
            calculateTree(true);
        }
        

        e.target.parentElement.remove();
        saveData();
    }
}, false);

habitList.addEventListener("dblclick", function(e){
    if(e.dblClickState){
        exception = "Habit already dblclicked!";
        throw new Error(exception);
    } 
    if(e.target.tagName === "LI"){
        e.dblClickState = true;
        const delButton = e.target.lastChild;
        e.target.removeChild(delButton);
        const habitValueBefore = e.target.innerText;

        const input = document.createElement("input");
        input.value = habitValueBefore;

        const updateButton = document.createElement("button");
        
        updateButton.innerHTML = "Update";
        updateButton.classList.toggle("updateButton");

        e.target.innerHTML = "";
        e.target.appendChild(input);
        e.target.appendChild(updateButton);

        updateButton.addEventListener("click", function(){
            const parent = updateButton.parentNode;
            parent.innerHTML = input.value;
            parent.appendChild(delButton);
            e.dblClickState = false;
        })
    }
})

input.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        createHabit();
    }
});

function calculateTree (){

    try{

        if(habitsCounter === 0 || checkedHabits === 0){
            treeWidth = 5;
            treeHeight = 10;
        }else{
            treeWidth = MAXtreeWidth*(checkedHabits/habitsCounter);
            treeHeight = MAXtreeHeight*(checkedHabits/habitsCounter);
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
    localStorage.setItem("checkedHabits", checkedHabits);
}

function saveTreeData(){
    localStorage.setItem("tree-width", tree.style.width);
    localStorage.setItem("tree-height", tree.style.height);

    localStorage.setItem("treeWidth", treeWidth);
    localStorage.setItem("treeHeight", treeHeight);
}

function showData(){
    habitList.innerHTML = localStorage.getItem("data");
    tree.style.width = localStorage.getItem("tree-width");
    tree.style.height = localStorage.getItem("tree-height");
    habitsCounter = Number(localStorage.getItem("habitsCounter")) || 0;
    checkedHabits = Number(localStorage.getItem("checkedHabits")) || 0;

    treeWidth = parseFloat(localStorage.getItem("treeWidth")) || 5;
    treeHeight = parseFloat(localStorage.getItem("treeHeight")) || 10;
    //console.log(treeWidth);
}
showData();

let habitListChildren = new Array(habitList.children);


function checkAndResetDaily(){
    const lastResetDate = localStorage.getItem("last-reset-date");
    const today = new Date().toDateString();
    //console.log(lastResetDate, today)
    if(lastResetDate !== today){
        // Neuer Tag - reset alle habits
        Array.from(habitList.children).forEach(element => {
            element.classList.remove("checked");
        });
        
        checkedHabits = 0;
        treeWidth = 5;
        treeHeight = 10;
        
        tree.style.width = treeWidth + "px";
        tree.style.height = treeHeight + "px";
        saveTreeData();

        //console.log(tree.style.width, tree.style.height, treeHeight, treeWidth)
        localStorage.setItem("last-reset-date", today);
        saveData();
    }
}

showData();
checkAndResetDaily(); // Nach dem Laden prüfen