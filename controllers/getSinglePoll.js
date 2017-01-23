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
    var myOpt = pollObject.options;
    var forChart = [];
    var forOffset = {};
    var count = 0;
    
    document.title = pollObject.title;
    
    var newtitle = document.createElement("h2");
        newtitle.innerHTML = pollObject.title;
        newtitle.setAttribute("id", "titleft");
        document.getElementById("poll-title").appendChild(newtitle);
    
    for (var name in myOpt) {
        var value = myOpt[name];
        forChart.push([name, value]);
        
        forOffset[count] = {offset: 0.05};
        count += 1;
        
        var newanc = document.createElement("a");
        newanc.setAttribute("id", name);
        newanc.setAttribute("href", "/addvote/poll=" + pollObject.id + "/option=" + name);
        document.getElementById("votefor").appendChild(newanc);
        
        var newdiv = document.createElement("div");
        newdiv.className += "oppt";
        newdiv.innerHTML = name;
        document.getElementById(name).appendChild(newdiv);
        
    }
    
    google.charts.load('current', {'packages':['corechart']});

    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Option');
        data.addColumn('number', 'Count');
        data.addRows(forChart);
        
        var options = { "width": 600,
                        "height": 450,
                        "backgroundColor": "#ecf0f1",
                        "chartArea": {
                            "left": 10,
                            "top": 80,
                            "width": 500,
                            "height": 300
                        },
                        "legend": {
                            "position": "left"
                        },
                        "tooltip": {
                            "text": "value"
                        },
                        "sliceVisibilityThreshold": 0,
                        "slices": forOffset
                        };

        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
    
    var newancsh = document.createElement("a");
    newancsh.setAttribute("id", "sharebtn");
    newancsh.setAttribute("href", "https://twitter.com/intent/tweet?text=" + pollObject.title + " " + window.location);
    newancsh.setAttribute("target", "_blank");
    document.getElementById("share").appendChild(newancsh);
      
    var newdivsh = document.createElement("div");
    newdivsh.className += "cont";
    newdivsh.innerHTML = "Share this poll";
    document.getElementById("sharebtn").appendChild(newdivsh);
}));