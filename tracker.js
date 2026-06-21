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

let delButton = document.createElement("button");
delButton.innerText = "Delete";
delButton.id = "delete";

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

        li.textContent = input.value;
        habitList.appendChild(li);
        li.appendChild(delButton.cloneNode(true));
        habitsCounter++;
        input.value ="";
        saveData();
    }catch (exception){
        throw new Error(exception);
    }
}

//wasser tracker
const waterIncreaseButton = document.getElementById("water-increase");
const waterDecreaseButton = document.getElementById("water-decrease");
const flowers = document.querySelectorAll(".flower");
const waterSegments = document.querySelectorAll(".water-segment");

let waterLevel = 0;
let MAXwaterLevel = 6; // 6 Abschnitte a 0,5 Liter = 3 Liter

let baseFlowerHeight = 30;
let MAXflowerHeight = 80;

let baseFlowerWidth = 15;
let MAXflowerWidth = 30;

function updateFlowers(){
    let ratio = (waterLevel/5) / MAXwaterLevel;
    let newHeight = baseFlowerHeight + (MAXflowerHeight - baseFlowerHeight) * ratio;
    let newWidth = baseFlowerWidth + (MAXflowerWidth - baseFlowerWidth) * ratio;

    flowers.forEach(function(flower){
        flower.style.height = newHeight + "px";
        flower.style.width = newWidth + "px";
    });

    updateWaterBar();
    saveWaterData();
}

function updateWaterBar(){
    waterSegments.forEach(function(segment, index){
        if(index < waterLevel){
            segment.classList.add("filled");
        }else{
            segment.classList.remove("filled");
        }
    });
}

function saveWaterData(){
    localStorage.setItem("waterLevel", waterLevel);
}

function showWaterData(){
    waterLevel = Number(localStorage.getItem("waterLevel")) || 0;
    updateFlowers();
}

waterIncreaseButton.addEventListener("click", function(){
    if(waterLevel < MAXwaterLevel){
        waterLevel++;
        updateFlowers();
    }
});

waterDecreaseButton.addEventListener("click", function(){
    if(waterLevel > 0){
        waterLevel--;
        updateFlowers();
    }
});

showWaterData();

habitList.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        if(!e.target.classList.contains("checked")){
            e.target.classList.toggle("checked");
            checkedHabits++;
            calculateTree();
            //console.log(e.target);
            saveData();
        }else{
            e.target.removeAttribute("class");
            checkedHabits--;
            calculateTree(true);
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

    if(e.target.classList.contains("updateButton")){
        const input = e.target.previousSibling;
        const parent = e.target.parentNode;
        parent.textContent = (input.value) ? input.value : "";
        parent.appendChild(delButton.cloneNode(true));
        dblClickState = false;
        saveData();
    }
}, false);

const updateButton = document.createElement("button");
updateButton.textContent = "Update";
updateButton.classList.toggle("updateButton");

const updateInput = document.createElement("input");


habitList.addEventListener("dblclick", function(e){
    console.log("dblclick fired");
    console.log("dblClickState:", dblClickState, typeof dblClickState);
    console.log("target tag:", e.target.tagName);

    if(dblClickState === true){
        console.log(dblClickState)
        return;
    }
    if(e.target.tagName === "LI" && dblClickState === false){
        console.log("inside LI block");
        let habitButton = e.target.lastChild;
        console.log("lastChild:", habitButton, habitButton.id);
        if(habitButton.id === "delete"){
            dblClickState = true;
            e.target.removeChild(habitButton);
            const habitValueBefore = e.target.innerText;
            updateInput.value = habitValueBefore;
            e.target.textContent = "";
            e.target.appendChild(updateInput);
            e.target.appendChild(updateButton);
            saveData();
        }
    }
})

input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
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
    localStorage.setItem("data", habitList.textContent);
    localStorage.setItem("habitsCounter", habitsCounter);
    localStorage.setItem("checkedHabits", checkedHabits);
    localStorage.setItem("dblClickState", dblClickState);
}

function saveTreeData(){
    localStorage.setItem("tree-width", tree.style.width);
    localStorage.setItem("tree-height", tree.style.height);

    localStorage.setItem("treeWidth", treeWidth);
    localStorage.setItem("treeHeight", treeHeight);
}

function showData(){
    habitList.textContent = localStorage.getItem("data");
    tree.style.width = localStorage.getItem("tree-width");
    tree.style.height = localStorage.getItem("tree-height");
    habitsCounter = Number(localStorage.getItem("habitsCounter")) || 0;
    checkedHabits = Number(localStorage.getItem("checkedHabits")) || 0;

    treeWidth = parseFloat(localStorage.getItem("treeWidth")) || 5;
    treeHeight = parseFloat(localStorage.getItem("treeHeight")) || 10;
    dblClickState = localStorage.getItem("dblClickState") === "true";
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
        dblClickState = false;
        checkedHabits = 0;
        treeWidth = 5;
        treeHeight = 10;
        
        tree.style.width = treeWidth + "px";
        tree.style.height = treeHeight + "px";
        saveTreeData();

        // Wasserstand zurücksetzen
        waterLevel = 0;
        updateFlowers();

        //console.log(tree.style.width, tree.style.height, treeHeight, treeWidth)
        localStorage.setItem("last-reset-date", today);
        saveData();
    }
}

showData();
checkAndResetDaily(); // Nach dem Laden prüfen