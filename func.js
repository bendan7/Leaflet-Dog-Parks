

function findPark() {
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(minDis);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }      
}
  
    
function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit=="K") { dist = dist * 1.609344; }
	if (unit=="N") { dist = dist * 0.8684; }
	return dist;
}
 
    
function minDis(MyPos) {
    var x2=MyPos.coords.longitude;
    var y2=MyPos.coords.latitude;
    var greenIcon = L.icon({
        iconUrl: 'leaf-green.png',
        shadowUrl: 'leaf-shadow.png',
        iconSize:     [38, 95], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    
    
    $.getJSON("Dog-ParksW84.geojson", function(json) {
        //first position for reference
        var x1=Number(json.features[0].geometry.coordinates[0]);
        var y1=Number(json.features[0].geometry.coordinates[1]);
        
        //my postion
        var x2=MyPos.coords.longitude;
        var y2=MyPos.coords.latitude;

        //test driver
        /*    var y2=32.0725448;
        var x2=34.7861868;   */ 
        var min=distance(x1,y1,x2,y2,'K');
        var index=0;
        var minParkIndex=0;
        
        (json.features).forEach(function (park){
            try {
                console.log(park.geometry["coordinates"][0]);
                console.log(park.geometry["coordinates"][1]);
                var x1=Number(park.geometry["coordinates"][0]);
                var y1=Number(park.geometry["coordinates"][1]);    
                var tmp = distance(x1,y1,x2,y2,'K');
            }
    
            catch(err){}

                if(tmp<min){
                    min=tmp;
                    minParkIndex=index;  
                }
                index++;
        })
        x1=Number(json.features[minParkIndex].geometry["coordinates"][0]);
        y1=Number(json.features[minParkIndex].geometry["coordinates"][1]);
        var myPosi=L.latLng(y2, x2);
        var parkPosi=L.latLng(y1,x1);
        L.Routing.control({
                            waypoints: [
                                        myPosi,
                                        parkPosi
                                        ],
                            createMarker: function(i, waypoints, n){ 
                                return L.marker(waypoints.latLng, {icon: greenIcon})
                            }
        }).addTo(map);       
    });
}
