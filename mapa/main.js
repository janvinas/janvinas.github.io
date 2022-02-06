var autoupdate = setInterval(function(){ 
    updateMap();  
}, 1000);
var currentPopup;
const http = new XMLHttpRequest();
const url = "https://api.mine.cat/api/gettrains";

var map = L.map('mapdiv', {
    crs: L.CRS.Simple,
    minZoom: -2,
});

var bounds = [[-3106,-3072], [4576,3072]];
var image = L.imageOverlay('minecat.png', bounds).addTo(map);
map.fitBounds(bounds);

var trainsLayer = L.layerGroup().addTo(map);


var icon446 = L.icon({
    iconUrl: 'icons/es446v.png',
    
    iconSize: [40, 48],
    iconAnchor: [20, 24],
    popupAnchor: [0, 0]
});

var trainIcon = L.Icon.extend({
    options:{
        iconSize: [40, 48],
        iconAnchor: [20, 24],
        popupAnchor: [0, -20]
    }
});

function getIcon(trainName){
    if(trainName.includes('R1') || trainName.includes('R4') ||trainName.includes('R8')){
        return new trainIcon({iconUrl: 'icons/es446v.png'});
    }else if(trainName.includes('S1')){
        return new trainIcon({iconUrl: 'icons/es-fgc113.png'}); //no existeix la serie 115
    }else if(trainName.includes('S2')){
        return new trainIcon({iconUrl: 'icons/es-fgc213.png'});
    }else if(trainName.includes('R2')){
        return new trainIcon({iconUrl: 'icons/es450v.png'});
    }else if(trainName.includes('Euromed')){
        return new trainIcon({iconUrl: 'icons/es130.png'});
    }else{
        return new L.Icon.Default();
    }
};

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
            
            var trainIcon = getIcon(trainname);
            var marker = L.marker([convertRange(coordz, [-3106, 4576], [4576, -3106]), coordx], {icon: trainIcon}).bindPopup(trainname).addTo(trainsLayer);
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
