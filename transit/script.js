const http = new XMLHttpRequest();
const url = "https://api.mine.cat/api/registeredstations";
const url2 = "https://api.mine.cat/api/departures/"

var stationlist;

//run at startup
querySuggestions();

function querySuggestions(){
    http.open("GET", url, true);
    http.send();
    http.onreadystatechange = (e) => {
        if(http.readyState == 4 && http.status == 200){
            var resp = http.responseText.replace("{", "[").replace("}", "]");
            stationlist = JSON.parse(resp);
            console.log(stationlist);
            setSuggestions();
        }
    }
}

function setSuggestions(){
    document.getElementById("stationlist").style.display = "inline-block";
    document.getElementById("departurelist").style.display = "none";
    document.getElementById("stationinfo").style.display = "none";
    document.getElementById("departurelist").innerHTML = "";
    var input = document.getElementById("searchstation");
    document.getElementById("stationlist").innerHTML = "";
    stationlist.forEach(element => {
        if(element.toLowerCase().includes(input.value.toLowerCase())){
            var button = document.createElement("button");
            button.innerHTML = element;
            button.id = element;
            button.setAttribute("onClick", "searchDepartures(this.id)");
            document.getElementById("stationlist").appendChild(button);
        }
    });

}

function searchDepartures(id){
    document.getElementById("stationlist").style.display = "none";
    document.getElementById("departurelist").style.display = "inline-block";
    document.getElementById("stationinfo").style.display = "block";
    document.getElementById("stationname").innerHTML = id;
    document.getElementById("departurelist").innerHTML="";

    http.open("GET", url2 + id, true);
    http.send()
    http.onreadystatechange = (e) =>{
        if(http.readyState == 4 && http.status == 200){
            var departurelist = JSON.parse(http.responseText);
            console.log(departurelist);
            departurelist = departurelist.sort((a, b) => {
                return new Date(a.time) - new Date(b.time); // ascending
            });
            
            departurelist.forEach(element =>{
                var div = document.createElement("div")
                var color = parseInt(element.delay) > 20 ? "red" : "white";
                div.innerHTML = `<div class="time" style="color: ${color}"}><strong>${formatTime(new Date(element.time))}</strong></div>
                <div><strong>${element.name}</strong></div>
                <div class="destination" onclick="searchDepartures(this.innerHTML)">${element.destination}</div>
                <div class="platform"><strong>${element.platform}</strong></div>`;
                document.getElementById("departurelist").appendChild(div);
            });
        }
    } 


    let now = new Date();
    document.getElementById("lastupdate").innerHTML = 
    "Actualitzat: " + formatTime(now);
}


function formatTime(date){
    return twoDigits(date.getHours()) + ":" + 
    twoDigits(date.getMinutes()) + ":" + 
    twoDigits(date.getSeconds());
}
function twoDigits(n){
    return  n < 10 ?  "0" + String(n) : String(n);
}