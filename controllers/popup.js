var InputN = 0;

function show(){
    document.getElementById("popup").style.display = "block";
}

function hide() {
    document.getElementById("popup").style.display = "none";
        
    document.getElementById("title").value = "";
        
    var allOptions = document.getElementsByName("opt");
    for (var o = 0; o < allOptions.length; o++) {
        allOptions[o].value = "";
    }
        
    var addedInputs = document.getElementsByClassName("extra-input");
    while(addedInputs[0]) {
        addedInputs[0].parentNode.removeChild(addedInputs[0]);
    }
        
    var allXBtns = document.getElementsByClassName("xbtn");
    while(allXBtns[0]) {
        allXBtns[0].parentNode.removeChild(allXBtns[0]);
    }
}
    
function addOpt() {
    InputN += 1;
    var regex = /.*\S+.*/;
    
    var newInput = document.createElement("input");
    var newBtnX = document.createElement("button");
        
    newInput.type = "text";
    newInput.setAttribute("name", "opt");
    newInput.setAttribute("id", "input"+InputN);
    newInput.setAttribute("required", "required");
    newInput.setAttribute("pattern", regex.source);
    newInput.className = "extra-input";
    document.getElementById("options").appendChild(newInput);
        
    newBtnX.type = "button";
    newBtnX.innerHTML = "X";
    newBtnX.value = "input"+InputN;
    newBtnX.className = "xbtn";
    newBtnX.setAttribute("onclick", "removeLine(this)");
    document.getElementById("options").appendChild(newBtnX);
}
    
function removeLine(objButton) {
    var inpLine = document.getElementById(objButton.value);
        
    inpLine.parentNode.removeChild(inpLine);
    objButton.parentNode.removeChild(objButton);
}