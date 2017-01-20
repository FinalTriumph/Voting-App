var apiUrl = window.location.origin + "/api/:id/mypolls";

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
    var pollsObject = JSON.parse(data);
    
    if (pollsObject.length === 0) {
        var newdiv = document.createElement("div");
        newdiv.className += "cont";
        newdiv.innerHTML = "No polls to display";
        document.getElementById("results").appendChild(newdiv);
    }
    
    pollsObject.forEach(function(poll){
        var newanc = document.createElement("a");
        newanc.setAttribute("id", poll.id);
        newanc.setAttribute("href", "/poll=" + poll.id);
        document.getElementById("results").appendChild(newanc);
        
        var newdiv = document.createElement("div");
        newdiv.className += "cont";
        newdiv.innerHTML = poll.title + "<br>" + poll.author;
        document.getElementById(poll.id).appendChild(newdiv);
    });
}));