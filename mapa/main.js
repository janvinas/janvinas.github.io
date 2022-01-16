var autoupdate = setInterval(function(){ 
    updateMap();  
}, 1000);
var currentPopup;
const http = new XMLHttpRequest();
const url = "http://mine.cat:8176/api/gettrains";

var map = L.map('mapdiv', {
    crs: L.CRS.Simple,
    minZoom: -2,
});

var bounds = [[-3106,-3072], [4576,3072]];
var image = L.imageOverlay('minecat.png', bounds).addTo(map);
map.fitBounds(bounds);

var trainsLayer = L.layerGroup().addTo(map);

function clearMap(){
    trainsLayer.clearLayers();
}

function updateMap(){

    http.open("GET", url, true);
    http.send();
    http.onreadystatechange = (e) => {
        var httpResponse = JSON.parse(http.responseText);
        console.log(httpResponse);
        clearMap();
        for(x in httpResponse){
            trainname = x;
            traincoords = httpResponse[x];
            var coordx = traincoords.substring(traincoords.indexOf(":") + 1, traincoords.indexOf(","));
            var coordz = traincoords.substring(traincoords.lastIndexOf(",") + 1, traincoords.length)
            
            var marker = L.marker([convertRange(coordz, [-3106, 4576], [4576, -3106]), coordx]).bindPopup(trainname).addTo(trainsLayer);
            if(trainname == currentPopup) marker.openPopup();
        }
    }

}

function convertRange( value, r1, r2 ) { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

function onPopupOpen(e){
    currentPopup = e.popup.getContent();
}

function onMapClick(e){
    currentPopup = undefined;
    updateMap();
}

map.on('popupopen', onPopupOpen);
map.on('click', onMapClick);
