document.getElementById("updatemap").onclick = function(){
    updateMap();
}

document.getElementById("clearmap").onclick = function(){
    clearMap();
}

document.getElementById("autoupdate").onclick = function(){
    autoupdate = setInterval(function(){ 
        updateMap();  
    }, 1000);
}

document.getElementById("stopautoupdate").onclick = function(){
    clearInterval(autoupdate);
}

document.getElementById("closepopup").onclick = function(){
    currentPopup = undefined;
    updateMap();
}

document.getElementById("about").onclick = function(){
    document.getElementById("aboutpage").style.display = "block";
}

document.getElementById("closeabout").onclick = function(){
    document.getElementById("aboutpage").style.display = "none";
}