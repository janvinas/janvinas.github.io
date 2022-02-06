document.getElementById("updatemap").onclick = function(){
    updateMap();
}

document.getElementById("clearmap").onclick = function(){
    clearMap();
}

document.getElementById("autoupdate").onclick = function(){
    if(autoupdate != undefined) return;
    autoupdate = setInterval(function(){ 
        updateMap();  
    }, 1000);
}

document.getElementById("stopautoupdate").onclick = function(){
    clearInterval(autoupdate);
    autoupdate = undefined;
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