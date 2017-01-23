var vfor = document.getElementById("add-new");
    
var newbtnadd = document.createElement("button");
    newbtnadd.className = "aosvbtn";
    newbtnadd.innerHTML = "Add new option";
    newbtnadd.setAttribute("id", "addbtn");
    newbtnadd.style.display = "inline-block";
    newbtnadd.setAttribute("onclick", "showinput()");
vfor.appendChild(newbtnadd);
    
var newta = document.createElement("input");
    newta.style.display = "none";
    newta.setAttribute("id", "addoption");
vfor.appendChild(newta);

var newbtncnc = document.createElement("button");
    newbtncnc.style.display = "none";
    newbtncnc.innerHTML = "X";
    newbtncnc.className = "xbtn";
    newbtncnc.setAttribute("id", "cnc");
    newbtncnc.setAttribute("onclick", "closeno()");
vfor.appendChild(newbtncnc);

var linebreak = document.createElement("br");
vfor.appendChild(linebreak);
    
var newbtnvote = document.createElement("button");
    newbtnvote.style.display = "none";
    newbtnvote.className = "aosvbtn";
    newbtnvote.innerHTML = "Vote";
    newbtnvote.setAttribute("id", "svote");
    newbtnvote.setAttribute("onclick", "addnewvote()");
vfor.appendChild(newbtnvote);

function showinput(){
    document.getElementById("addoption").style.display = "inline-block";
    document.getElementById("svote").style.display = "inline-block";
    document.getElementById("cnc").style.display = "inline-block";
    document.getElementById("addbtn").style.display = "none";
}

function closeno() {
    document.getElementById("addoption").style.display = "none";
    document.getElementById("svote").style.display = "none";
    document.getElementById("cnc").style.display = "none";
    document.getElementById("addbtn").style.display = "inline-block";
    
    document.getElementById("addoption").value = "";
}
    
function addnewvote(){
    var newValue = document.getElementById("addoption").value;
    
    if (!newValue.replace(/\s/g, '').length) {
        alert("Please type in your new option.");
    } else {
        window.location.href = window.location.origin + "/addvote" + window.location.pathname + "/option=" + newValue;
    }
}