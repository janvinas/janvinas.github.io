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

var iconScale = localStorage.getItem("iconsize") != null ? localStorage.getItem("iconsize") : 1;

function getIcon(trainName){
    var trainIcon = L.Icon.extend({
        options:{
            iconSize: [40 * iconScale, 48 * iconScale],
            iconAnchor: [20 * iconScale, 24 * iconScale],
            popupAnchor: [0, -20 * iconScale]
        }
    });

    if(trainName.includes('R1') || trainName.includes('R4')){
        return new trainIcon({iconUrl: 'icons/es446v.png'});
    }else if(trainName.includes('S1')){
        return new trainIcon({iconUrl: 'icons/es-fgc113.png'}); //no existeix la serie 115
    }else if(trainName.includes('S2')){
        return new trainIcon({iconUrl: 'icons/es-fgc213.png'});
    }else if(trainName.includes('R2')){
        return new trainIcon({iconUrl: 'icons/es450v.png'});
    }else if(trainName.includes('Euromed')){
        return new trainIcon({iconUrl: 'icons/es130.png'});
    }else if(trainName.includes('RL1') || trainName.includes('RL2')){
        return new trainIcon({iconUrl: 'icons/es-fgc231.png'});
    }else if(trainName.includes('L8')){
        return new trainIcon({iconUrl: 'icons/es-fgc213.png'});
    }else if(trainName.includes('R8')){
        return new trainIcon({iconUrl: 'icons/es464v.png'});
    }else if(trainName.includes('L12')){
        return new trainIcon({iconUrl: 'icons/es-fgc113.png'}); //no existeix la serie 114
    }else if(trainName.includes('FMBL4')){
        return new trainIcon({iconUrl: 'icons/es-mbcn2000r.png'});
    }else if(trainName.includes('FMBL5')){
        return new trainIcon({iconUrl: 'icons/es-mbcn6000.png'});
    }else if(trainName.includes('C1') || trainName.includes('C2')){
        return new trainIcon({iconUrl: 'icons/es446.png'});
    }else if(trainName.includes('C3')){
        return new trainIcon({iconUrl: 'icons/es592.png'});
    }else if(trainName.includes('Bus')){
        return new trainIcon({iconUrl: 'icons/bus.png', iconSize: [40 * iconScale, 40* iconScale]});
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
        if(http.readyState == 4 && http.status == 200){
            var httpResponse = JSON.parse(http.responseText);
            console.debug(httpResponse);
            clearMap();
            setIconSize();
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

function setIconSize(){
    var slider = document.getElementById("iconsize");
    if(slider.value == 0){
        iconScale = 0.5;
    }else if(slider.value == 1){
        iconScale = 0.75;
    }else if(slider.value == 2){
        iconScale = 1;
    }else if(slider.value == 3){
        iconScale = 1.5;
    }else{
        iconScale = 1;
    }
    localStorage.setItem("iconsize", iconScale);
}

map.on('popupopen', onPopupOpen);
map.on('click', onMapClick);
