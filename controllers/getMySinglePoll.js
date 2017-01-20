var apiUrl = window.location.origin + "/api/:id" + window.location.pathname;

function ready(fn) {
    if (typeof fn !== "function") {
        return;
    }
    if (document.readyState === "complete") {
        return fn();
    }
    document.addEventListener("DOMContentLoaded", fn, false);
}
    
function ajaxRequest (method, url, callback) {
    var xmlhttp = new XMLHttpRequest();
        
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
        }
    };
    xmlhttp.open(method, url, true);
    xmlhttp.send();
}
    
ready(ajaxRequest("GET", apiUrl, function(data){
    var pollObject = JSON.parse(data);
    console.log(pollObject.options);
    
    var newdiv = document.createElement("div");
    newdiv.classname += "fullpoll";
    newdiv.innerHTML = pollObject.id + "<br>" 
        + pollObject.title + "<br>" 
        + pollObject.options + "<br>" 
        + pollObject.author;
    document.getElementById("poll").appendChild(newdiv);
    
    var newanc = document.createElement("a");
    
    newanc.innerHTML = "Delete";
    newanc.setAttribute("href", "/delete/poll=" + pollObject.id);
    document.getElementById("poll").appendChild(newanc);
    
}));