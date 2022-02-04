// // Retrieve token //
// var token;
// $.ajax
//   ({
//     type: "POST",
//     url: "https://developers.onemap.sg/privateapi/auth/post/getToken",
//     dataType: 'json',
//     async: false,
//     data: {"email": "cepheiv@gmail.com", "password": "Test123!"},
//     success: function (data){
//         token = data.access_token;
//     },s
//     error: function (ex){
//         console.log(ex.responseText);
//     }
// });

// Define address variables
var searchLatitude;
var searchLongitude;
var searchval;
var heremarker = null;

var customMarker = L.AwesomeMarkers.icon({
  prefix: 'fa',
  markerColor: 'red',
  icon: 'circle'
})

// Setup search bar for users to search based on their queries
var input = document.getElementById("searchBar");
input.addEventListener("keypress", function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchval = document.getElementById("searchBar").value;
    $.ajax
    ({
      url: "https://developers.onemap.sg/commonapi/search?searchVal=" + searchval + "&returnGeom=Y&getAddrDetails=Y&pageNum=1",
      async: true,
      success: function(results){
        if (results.found > 0) {
        searchLatitude = results.results[0].LATITUDE;
        searchLongitude = results.results[0].LONGITUDE;
        map.flyTo([searchLatitude, searchLongitude],16);
        var popup = L.popup()
        .setContent('Your result: ' + results.results[0].ADDRESS)
        .setLatLng([searchLatitude, searchLongitude])
        .openOn(map);
        if (heremarker != null) {
          map.removeLayer(heremarker);
        }
        heremarker = new L.Marker([searchLatitude, searchLongitude], {bounceOnAdd: true, icon: customMarker}).bindPopup(popup,{minWidth:50}).addTo(map);
        } else {
          alert("No results found.")
        }
      }
    })
  }
});

// Setup search button for user to search based on their queries
$("#searchButton").click(function() {
  searchval = document.getElementById("searchBar").value;
  console.log(searchval)
  $.ajax
  ({
    url: "https://developers.onemap.sg/commonapi/search?searchVal=" + searchval + "&returnGeom=Y&getAddrDetails=Y&pageNum=1",
    async: true,
    success: function(results){
      if (results.found > 0) {
      searchLatitude = results.results[0].LATITUDE;
      searchLongitude = results.results[0].LONGITUDE;
      map.flyTo([searchLatitude, searchLongitude],16);
      var popup = L.popup()
      .setContent('Your result: ' + results.results[0].ADDRESS)
      .setLatLng([searchLatitude, searchLongitude])
      .openOn(map);
      if (heremarker != null) {
        map.removeLayer(heremarker);
      }
      heremarker = new L.Marker([searchLatitude, searchLongitude], {bounceOnAdd: true, icon: customMarker}).bindPopup(popup,{minWidth:50}).addTo(map);
      } else {
        alert("No results found.")
     }
    }
  })
});

// Setup Autocomplete
$(document).ready(function(){
  function log(message) {
    $("<div>").text(message).prependTo("#searchBar");
    $("#searchBar").scrollTop(0);
  }
  $("#searchBar").autocomplete({
        source: function(request, response) {
          $.ajax
          ({
            url: "https://developers.onemap.sg/commonapi/search?searchVal=" + request.term + "&returnGeom=Y&getAddrDetails=Y&pageNum=1",
            async: true,
            success: function(data) {
              var output = []
              for (var i = 0; i < data.results.length; i++) {
                if (data.results[i].BLK_NO == ""){
                  output[i] = data.results[i].ADDRESS
                } else
                output[i] = data.results[i].BLK_NO + " " + data.results[i].ROAD_NAME + " SINGAPORE " +  data.results[i].POSTAL
              }
              //return length of output, i.e. 10 results
              response(output.slice(0,output.length))
            }
          })
        },
      minLength: 2,
      select: function( event, ui ) {
        log( ui.item ?
          "Selected: " + ui.item.label :
          "Nothing selected, input was " + this.value);
          document.getElementById('searchButton').click();
      },
      open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
      }
    })
  })

// to input searchlat and seachlong to run getLocation, consider editing "You are here"

// Set up map (http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png)
var center = L.bounds([1.51, 104.183], [1.16, 103.502]).getCenter();
var map = L.map('mapdiv').setView([1.355, 103.835], 12);
var basemap = L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
  detectRetina: true,
  maxZoom: 19,
  minZoom: 10
});
//map.setMaxBounds([[1.49, 104.153], [1.15, 103.6]]);
basemap.addTo(map);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Browser is not supported.");
  }
}

function showPosition(position) {
  var popup = L.popup()
  .setContent('You are here!')
  .setLatLng([position.coords.latitude, position.coords.longitude])
  .openOn(map);
  heremarker = new L.Marker([position.coords.latitude, position.coords.longitude], {bounceOnAdd: true, icon: customMarker}).bindPopup(popup,{minWidth:100}).addTo(map);        
  map.flyTo([position.coords.latitude, position.coords.longitude],16);
  //Set Timeout to remove heremarker
  //setTimeout(function() {
  //  heremarker.remove()}, 10000);
}

// Click to find current location or search nearby //
$("#currentlocation").click(function() {
  getLocation()
})

var popuptemp =
  '<p><strong>{programmeName}</strong><p>' +
  '<p><strong>{buildingName}</strong><p>' +
  '<strong>Type of Collection and E-waste accepted:</strong><br>{collectionType}<p>' +
  '<strong>Address:</strong><br>{streetName}, SINGAPORE {postalCode}<p>' +
  '<strong>Latitude & Longitude</strong><br>LatLng<p>' +
  '<strong>More information at:</strong><br>{hyperlink}';


//var binCluster = L.markerClusterGroup({showCoverageOnHover:false});
//var bbBinCluster = L.markerClusterGroup({showCoverageOnHover:false});
//var batteryBinCluster = L.markerClusterGroup({showCoverageOnHover:false});
//var mannedCluster = L.markerClusterGroup({showCoverageOnHover:false});
//var nonregCluster = L.markerClusterGroup({showCoverageOnHover:false});
//var inktonerCluster = L.markerClusterGroup({showCoverageOnHover:false});

var promise = $.getJSON("./mapdata/ewaste.json");
promise.then(function(data) {
  var binCluster = L.markerClusterGroup({showCoverageOnHover:false, maxClusterRadius:120}).addTo(map);
  var eBinMarker = [];
  var bbBinMarker = [];
  var batteryBinMarker =[];
  var mannedMarker = [];
  var nonregMarker = [];
  var inktonerMarker = [];
  var eBinlayerGroup = L.layerGroup();
  var bbBinlayerGroup = L.layerGroup();
  var batteryBinlayerGroup = L.layerGroup();
  var mannedlayerGroup = L.layerGroup();
  var nonreglayerGroup = L.layerGroup();
  var inktonerlayerGroup = L.layerGroup();
  for (var i = 1; i < data.SrchResults.length; i++) {
    var collectionType = data.SrchResults[i].DESCRIPTION;
    var programmeName = data.SrchResults[i].NAME;
    if (collectionType == "Bin collection; E-waste accepted: ICT equipment, Batteries and Lamps only" || collectionType == "Manned collection (Contact staff for disposal); E-waste accepted: ICT equipment, Batteries and Lamps only" || collectionType ==  "Drop-off and Bin Collection; All regulated e-waste under First Schedule at https://go.gov.sg/prod-def-sl, Large Household Appliances, ICT Equipment, Portable Batteries, Lamps, Electric Mobility Devices") {
      var programmeName = data.SrchResults[i].NAME;
      var buildingName = data.SrchResults[i].ADDRESSBUILDINGNAME;
      var LatLng = data.SrchResults[i].LatLng;
      var lat = parseFloat(LatLng.split(',')[0]);
      var lng = parseFloat(LatLng.split(',')[1]);
      var collectionType = data.SrchResults[i].DESCRIPTION;
      var streetName = data.SrchResults[i].ADDRESSSTREETNAME;
      var postalCode = data.SrchResults[i].ADDRESSPOSTALCODE;
      var hyperlink = data.SrchResults[i].HYPERLINK;
      var popup = popuptemp.replace('{programmeName}',programmeName)
      .replace('{buildingName}',buildingName)
      .replace('{collectionType}',collectionType)
      .replace('{streetName}',streetName)
      .replace('{postalCode}',postalCode)
      .replace('LatLng',LatLng)
      .replace('{hyperlink}',hyperlink);
      var binicon = L.AwesomeMarkers.icon({
        prefix: 'fa',
        markerColor: 'blue',
        icon: 'laptop'
      });
      eBinMarker = L.marker([lat, lng], {icon: binicon}).bindPopup(popup,{minWidth:100});
      eBinMarker.on('click',function(e){
          var popup = e.target.getPopup();
          var content = popup.getContent();
          const element = document.getElementById("result");
          element.innerHTML = content;
      })
      eBinlayerGroup.addLayer(eBinMarker)
      } else if (collectionType == "Bin collection; E-waste accepted: Batteries and Lamps only" || collectionType == "Manned collection (Contact staff for disposal); E-waste accepted: Batteries and Lamps only") {
        var programmeName = data.SrchResults[i].NAME;
        var buildingName = data.SrchResults[i].ADDRESSBUILDINGNAME;
        var LatLng = data.SrchResults[i].LatLng;
        var lat = parseFloat(LatLng.split(',')[0]);
        var lng = parseFloat(LatLng.split(',')[1]);
        var collectionType = data.SrchResults[i].DESCRIPTION;
        var streetName = data.SrchResults[i].ADDRESSSTREETNAME;
        var postalCode = data.SrchResults[i].ADDRESSPOSTALCODE;
        var hyperlink = data.SrchResults[i].HYPERLINK
        var popup = popuptemp.replace('{programmeName}',programmeName)
        .replace('{buildingName}',buildingName)
        .replace('{collectionType}',collectionType)
        .replace('{streetName}',streetName)
        .replace('{postalCode}',postalCode)
        .replace('LatLng',LatLng)
        .replace('{hyperlink}',hyperlink);
        var binicon = L.AwesomeMarkers.icon({
        prefix: 'fa',
        markerColor: 'green',
        icon: 'lightbulb'
        })
        bbBinMarker = L.marker([lat, lng], {icon: binicon}).bindPopup(popup,{minWidth:100});
        bbBinMarker.on('click',function(e){
            var popup = e.target.getPopup();
            var content = popup.getContent();
            const element = document.getElementById("result");
            element.innerHTML = content;
        })
        bbBinlayerGroup.addLayer(bbBinMarker)
    } else if (collectionType == "Bin collection; E-waste accepted: Batteries only") {
        var programmeName = data.SrchResults[i].NAME
        var buildingName = data.SrchResults[i].ADDRESSBUILDINGNAME;
        var LatLng = data.SrchResults[i].LatLng;
        var lat = parseFloat(LatLng.split(',')[0]);
        var lng = parseFloat(LatLng.split(',')[1]);
        var collectionType = data.SrchResults[i].DESCRIPTION;
        var streetName = data.SrchResults[i].ADDRESSSTREETNAME;
        var postalCode = data.SrchResults[i].ADDRESSPOSTALCODE;
        var hyperlink = data.SrchResults[i].HYPERLINK
        var popup = popuptemp.replace('{programmeName}',programmeName)
        .replace('{buildingName}',buildingName)
        .replace('{collectionType}',collectionType)
        .replace('{streetName}',streetName)
        .replace('{postalCode}',postalCode)
        .replace('LatLng',LatLng)
        .replace('{hyperlink}',hyperlink);
        var binicon = L.AwesomeMarkers.icon({
        prefix: 'fa',
        markerColor: 'red',
        icon: 'battery-quarter'
        })
        batteryBinMarker = L.marker([lat, lng], {icon: binicon}).bindPopup(popup,{minWidth:100});
        batteryBinMarker.on('click',function(e){
            var popup = e.target.getPopup();
            var content = popup.getContent();
            const element = document.getElementById("result");
            element.innerHTML = content;
        })
        batteryBinlayerGroup.addLayer(batteryBinMarker)
      } else if (collectionType == "Manned collection (Contact staff for disposal); E-waste accepted: ICT equipment and Batteries only") {
        var programmeName = data.SrchResults[i].NAME;
        var buildingName = data.SrchResults[i].ADDRESSBUILDINGNAME;
        var LatLng = data.SrchResults[i].LatLng;
        var lat = parseFloat(LatLng.split(',')[0]);
        var lng = parseFloat(LatLng.split(',')[1]);
        var collectionType = data.SrchResults[i].DESCRIPTION;
        var streetName = data.SrchResults[i].ADDRESSSTREETNAME;
        var postalCode = data.SrchResults[i].ADDRESSPOSTALCODE;
        var hyperlink = data.SrchResults[i].HYPERLINK
        var popup = popuptemp.replace('{programmeName}',programmeName)
        .replace('{buildingName}',buildingName)
        .replace('{collectionType}',collectionType)
        .replace('{streetName}',streetName)
        .replace('{postalCode}',postalCode)
        .replace('LatLng',LatLng)
        .replace('{hyperlink}',hyperlink);
        var binicon = L.AwesomeMarkers.icon({
        prefix: 'fa',
        markerColor: 'cadetblue',
        icon: 'laptop'
        })
        mannedMarker = L.marker([lat, lng], {icon: binicon}).bindPopup(popup,{minWidth:100});
        mannedMarker.on('click',function(e){
            var popup = e.target.getPopup();
            var content = popup.getContent();
            const element = document.getElementById("result");
            element.innerHTML = content;
        })
        mannedlayerGroup.addLayer(mannedMarker)
      } else if (programmeName == "Virogreen NECDC E-waste Recycling Programme for Non-regulated E-waste") {
        var programmeName = data.SrchResults[i].NAME;
        var buildingName = data.SrchResults[i].ADDRESSBUILDINGNAME;
        var LatLng = data.SrchResults[i].LatLng;
        var lat = parseFloat(LatLng.split(',')[0]);
        var lng = parseFloat(LatLng.split(',')[1]);
        var collectionType = data.SrchResults[i].DESCRIPTION;
        var streetName = data.SrchResults[i].ADDRESSSTREETNAME;
        var postalCode = data.SrchResults[i].ADDRESSPOSTALCODE;
        var hyperlink = data.SrchResults[i].HYPERLINK
        var popup = popuptemp.replace('{programmeName}',programmeName)
        .replace('{buildingName}',buildingName)
        .replace('{collectionType}',collectionType)
        .replace('{streetName}',streetName)
        .replace('{postalCode}',postalCode)
        .replace('LatLng',LatLng)
        .replace('{hyperlink}',hyperlink);
        var binicon = L.AwesomeMarkers.icon({
        prefix: 'fa',
        markerColor: 'purple',
        icon: 'recycle'
        })
        nonregMarker = L.marker([lat, lng], {icon: binicon}).bindPopup(popup,{minWidth:100});
        nonregMarker.on('click',function(e){
            var popup = e.target.getPopup();
            var content = popup.getContent();
            const element = document.getElementById("result");
            element.innerHTML = content;
        })
        nonreglayerGroup.addLayer(nonregMarker)
      } else if (programmeName == "Shell-Metalo E-waste Recycling Programme for Non-regulated E-waste") {
        var programmeName = data.SrchResults[i].NAME;
        var buildingName = data.SrchResults[i].ADDRESSBUILDINGNAME;
        var LatLng = data.SrchResults[i].LatLng;
        var lat = parseFloat(LatLng.split(',')[0]);
        var lng = parseFloat(LatLng.split(',')[1]);
        var collectionType = data.SrchResults[i].DESCRIPTION;
        var streetName = data.SrchResults[i].ADDRESSSTREETNAME;
        var postalCode = data.SrchResults[i].ADDRESSPOSTALCODE;
        var hyperlink = data.SrchResults[i].HYPERLINK
        var popup = popuptemp.replace('{programmeName}',programmeName)
        .replace('{buildingName}',buildingName)
        .replace('{collectionType}',collectionType)
        .replace('{streetName}',streetName)
        .replace('{postalCode}',postalCode)
        .replace('LatLng',LatLng)
        .replace('{hyperlink}',hyperlink);
        var binicon = L.AwesomeMarkers.icon({
        prefix: 'fa',
        markerColor: 'orange',
        icon: 'recycle'
        })
        nonregMarker = L.marker([lat, lng], {icon: binicon}).bindPopup(popup,{minWidth:100});
        nonregMarker.on('click',function(e){
            var popup = e.target.getPopup();
            var content = popup.getContent();
            const element = document.getElementById("result");
            element.innerHTML = content;
        })
        nonreglayerGroup.addLayer(nonregMarker)
      // } else if (collectionType == "Bin collection; E-waste accepted: Ink, toner cartridges") {
      //   var programmeName = data.SrchResults[i].NAME;
      //   var buildingName = data.SrchResults[i].ADDRESSBUILDINGNAME;
      //   var LatLng = data.SrchResults[i].LatLng;
      //   var lat = parseFloat(LatLng.split(',')[0]);
      //   var lng = parseFloat(LatLng.split(',')[1]);
      //   var collectionType = data.SrchResults[i].DESCRIPTION;
      //   var streetName = data.SrchResults[i].ADDRESSSTREETNAME;
      //   var postalCode = data.SrchResults[i].ADDRESSPOSTALCODE;
      //   var hyperlink = data.SrchResults[i].HYPERLINK
      //   var popup = popuptemp.replace('{programmeName}',programmeName)
      //   .replace('{buildingName}',buildingName)
      //   .replace('{collectionType}',collectionType)
      //   .replace('{streetName}',streetName)
      //   .replace('{postalCode}',postalCode)
      //   .replace('LatLng',LatLng)
      //   .replace('{hyperlink}',hyperlink);
      //   var binicon = L.AwesomeMarkers.icon({
      //   prefix: 'fa',
      //   markerColor: 'orange',
      //   icon: 'print'
      //   })
      //   inktonerMarker = L.marker([lat, lng], {icon: binicon}).bindPopup(popup,{minWidth:100});
      //   inktonerMarker.on('click',function(e){
      //       var popup = e.target.getPopup();
      //       var content = popup.getContent();
      //       const element = document.getElementById("result");
      //       element.innerHTML = content;
      //   })
      //   binCluster.addLayer(inktonerMarker)
      //   
    }
      binCluster.addLayer(eBinlayerGroup)
      binCluster.addLayer(bbBinlayerGroup)
      binCluster.addLayer(batteryBinlayerGroup)
      binCluster.addLayer(mannedlayerGroup)
      binCluster.addLayer(nonreglayerGroup)
        //binClusterNew = binCluster
        //map.removeLayer(eBinlayerGroup)
        //map.removeLayer(bbBinlayerGroup)
        //map.removeLayer(batteryBinlayerGroup)
        //map.removeLayer(mannedlayerGroup)
        //map.removeLayer(nonreglayerGroup)
        //map.removeLayer(inktonerlayerGroup)
    }
    
    var ict_click = true; // Set to false to show no icons by default
    var bulb_click = true;
    var battery_click = true;
    var nonreg_click = true;
    var inktoner_click = true;

    $("#allBin").click(function() {
      binCluster.addLayer(eBinlayerGroup)
      binCluster.addLayer(bbBinlayerGroup)
      binCluster.addLayer(batteryBinlayerGroup)
      binCluster.addLayer(mannedlayerGroup)
      binCluster.addLayer(nonreglayerGroup)
      map.addLayer(binCluster)
      ict_click = true;
      bulb_click = true;
      battery_click = true;
      manned_click = true;
      nonreg_click = true;
      inktoner_click = true;
    //map.addLayer(bbBinlayerGroup)
    //map.addLayer(batteryBinlayerGroup)
    //map.addLayer(mannedlayerGroup)
    //map.addLayer(nonreglayerGroup)
    //map.addLayer(inktonerlayerGroup)
    $("#ict,#bulb,#battery,#manned,#nonreg,#inktoner").prop('checked', true).change();
    })

    // Clear all markers / layers, except the basemap layer and boundary layer
    $("#clearall").click(function() {
    map.eachLayer(function (layer) {
      if (layer == basemap) {
      } else
      map.removeLayer(layer);
      ict_click = false;
      bulb_click = false;
      battery_click = false;
      nonreg_click = false;
      inktoner_click = false;
      $("#ict,#bulb,#battery,#manned,#nonreg,#inktoner").prop('checked', false).change();
      document.getElementById("result").innerHTML = "" // Clear info
        });
        binCluster.removeLayer(eBinlayerGroup)
        binCluster.removeLayer(bbBinlayerGroup)
        binCluster.removeLayer(batteryBinlayerGroup)
        binCluster.removeLayer(mannedlayerGroup)
        binCluster.removeLayer(nonreglayerGroup)
      boundaryLayer(); // Restore boundary layer
    })   

    // ICT click behaviour    
    $("#ict").click(function() {
      if (ict_click == false && bulb_click == false && battery_click == false) { //1
        binCluster.addLayer(eBinlayerGroup)
        binCluster.addLayer(mannedlayerGroup)
        map.addLayer(binCluster)
        ict_click = true
      } else if (ict_click == false && bulb_click == true && battery_click == false) { //2
        binCluster.addLayer(mannedlayerGroup)
        map.addLayer(binCluster)
        ict_click = true
      } else if (ict_click == false && bulb_click == false && battery_click == true) { //3
        // do nothing
        ict_click = true
      } else if (ict_click == false && bulb_click == true && battery_click == true) {  //4
        // do nothing
        ict_click = true
      } else if (ict_click == true && bulb_click == true && battery_click == true) {  //5
        // do nothing
        ict_click = false
      } else if (ict_click == true && bulb_click == true && battery_click == false) {  //6
        binCluster.removeLayer(mannedlayerGroup)
        map.addLayer(binCluster)
        ict_click = false
      } else if (ict_click == true && bulb_click == false && battery_click == true) {  //7
        // do nothing
        ict_click = false
      } else if (ict_click == true && bulb_click == false && battery_click == false) {  //8
        // Add eBin and manned layers only
        binCluster.removeLayer(eBinlayerGroup)
        binCluster.removeLayer(mannedlayerGroup)
        map.addLayer(binCluster)
        ict_click = false
      }
    })

    // bulb click behaviour    
    $("#bulb").click(function() {
      if (ict_click == false && bulb_click == false && battery_click == false) { //1
        binCluster.addLayer(eBinlayerGroup)
        binCluster.addLayer(bbBinlayerGroup)
        map.addLayer(binCluster)
        bulb_click = true
      } else if (ict_click == false && bulb_click == true && battery_click == false) { //2
        binCluster.removeLayer(eBinlayerGroup)
        binCluster.removeLayer(bbBinlayerGroup)
        map.addLayer(binCluster)
        bulb_click = false
      } else if (ict_click == false && bulb_click == false && battery_click == true) { //3
        // do nothing
        bulb_click = true
      } else if (ict_click == false && bulb_click == true && battery_click == true) {  //4
        // do nothing
        bulb_click = false
      } else if (ict_click == true && bulb_click == true && battery_click == true) {  //5
        // do nothing
        bulb_click = false
      } else if (ict_click == true && bulb_click == true && battery_click == false) {  //6
        binCluster.removeLayer(bbBinlayerGroup)
        map.addLayer(binCluster)
        bulb_click = false
      } else if (ict_click == true && bulb_click == false && battery_click == true) {  //7
        // do nothing
        bulb_click = true
      } else if (ict_click == true && bulb_click == false && battery_click == false) {  //8
        // Add eBin and manned layers only
        binCluster.addLayer(bbBinlayerGroup)
        map.addLayer(binCluster)
        bulb_click = true
      }
    })

        // bulb click behaviour    
    $("#battery").click(function() {
      if (ict_click == false && bulb_click == false && battery_click == false) { //1
        binCluster.addLayer(eBinlayerGroup)
        binCluster.addLayer(bbBinlayerGroup)
        binCluster.addLayer(mannedlayerGroup)
        binCluster.addLayer(batteryBinlayerGroup)
        map.addLayer(binCluster)
        battery_click = true
      } else if (ict_click == false && bulb_click == true && battery_click == false) { //2
        binCluster.addLayer(eBinlayerGroup)
        binCluster.addLayer(mannedlayerGroup)
        binCluster.addLayer(batteryBinlayerGroup)
        map.addLayer(binCluster)
        battery_click = true
      } else if (ict_click == false && bulb_click == false && battery_click == true) { //3
        binCluster.removeLayer(eBinlayerGroup)
        binCluster.removeLayer(bbBinlayerGroup)
        binCluster.removeLayer(mannedlayerGroup)
        binCluster.removeLayer(batteryBinlayerGroup)
        map.addLayer(binCluster)
        battery_click = false
      } else if (ict_click == false && bulb_click == true && battery_click == true) {  //4
        binCluster.removeLayer(eBinlayerGroup)
        binCluster.removeLayer(mannedlayerGroup)
        binCluster.removeLayer(batteryBinlayerGroup)
        map.addLayer(binCluster)
        battery_click = false
      } else if (ict_click == true && bulb_click == true && battery_click == true) {  //5
        binCluster.removeLayer(batteryBinlayerGroup)
        map.addLayer(binCluster)
        battery_click = false
      } else if (ict_click == true && bulb_click == true && battery_click == false) {  //6
        binCluster.addLayer(batteryBinlayerGroup)
        map.addLayer(binCluster)
        battery_click = true
      } else if (ict_click == true && bulb_click == false && battery_click == true) {  //7
        binCluster.removeLayer(batteryBinlayerGroup)
        map.addLayer(binCluster)
        battery_click = false
      } else if (ict_click == true && bulb_click == false && battery_click == false) {  //8
        // Add eBin and manned layers only
        binCluster.addLayer(batteryBinlayerGroup)
        map.addLayer(binCluster)
        battery_click = true
      }
    })

    // Show only non-reg products layer
    $("#nonreg").click(function() {
      if (nonreg_click == false) {
        // Add nonreg layer only
        binCluster.addLayer(nonreglayerGroup)
        map.addLayer(binCluster)
        //map.addLayer(nonreglayerGroup)
        nonreg_click = true
      } else {
        // Remove nonreg layer only
        binCluster.removeLayer(nonreglayerGroup)
        map.addLayer(binCluster)
        //map.removeLayer(nonreglayerGroup)
        nonreg_click = false
      }
    })

    // // Show only ink & toner cartridge layer
    // $("#inktoner").click(function() {
    //   if (inktoner_click == false) {
    //     // Add ink & toner layer only
    //     map.addLayer(inktonerlayerGroup)
    //     inktoner_click = true
    //   } else {
    //     map.removeLayer(inktonerlayerGroup)
    //     // Remove ink & toner layer only
    //     inktoner_click = false
    //   }
    // })
    
    
    addressPoints = addressPoints.map(function (p) { return [p[0], p[1], p[2]]; });
    console.log(addressPoints)
    var heat = L.heatLayer(addressPoints,{radius: 50, maxZoom: 1}).addTo(map);
    console.log(heat)

    // Bind popup to town council boundary layers
    function onEachFeature(feature, layer) {
      // does this feature have a property named TOWN_COUNCIL?
      if (feature.properties && feature.properties.TOWN_COUNCIL) {
        var town_council = feature.properties.TOWN_COUNCIL.replace("TC","TOWN COUNCIL")
          layer.bindTooltip(town_council,{
            autoClose: true,
            sticky: true
            //direction: 'center'
          });
      }
    }

    var boundaryLayer = function(data) {
      $.ajax({
      dataType: "json",
      url: "./mapdata/boundary.geojson",
      success: function(data) {
        $.each(data.features, function(key, data) {
          var color = data.properties.fill
          boundary = L.geoJson(data, {
            style: {
              "color": color,
              "weight": 1,
              "fillOpacity": 0.2
            },
            onEachFeature: onEachFeature
          }).addTo(map)
        })
      } 
    })
  }
  //boundaryLayer();

    // var popup = L.popup({
    //   closeButton: true,
    //   autoClose: false
    // })
    // .setLatLng([1.51, 104.183])
    // .setContent('<p>Text box on a map</p>')
    // .openOn(map);

    // L.Control.textbox = L.Control.extend({
    //   onAdd: function(map) {
        
    //   var text = L.DomUtil.create('div');
    //   text.id = "result";
    //   //text.innerHTML = "<strong>text here</strong>"
    //   return text;
    //   },
  
    //   onRemove: function(map) {
    //     // Nothing to do here
    //   }
    // });
    // L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
    // L.control.textbox({ position: 'bottomright' }).addTo(map);

  //   map.addControl(
  //     new L.Control.Search({
  //         position: 'topright',
  //         layer: nonreglayerGroup,
  //         initial: 'false',
  //         zoom: 11,
  //         marker: false,
  //         collapsed: false,
  //         autoCollapse: true,
  //         filterData: function (text, records) {
  //             // Search by title / address
  //             var result = {};
  //             for (var record in records) {
  //                 if (lowerCase(record).indexOf(text) > -1 || lowerCase(records[record].layer.options.address).indexOf(text) > -1) {
  //                     result[record] = records[record];
  //                 }
  //             }
  //             return result;
  //         }
  //     }).on('search:locationfound', function (e) {
  //         e.layer.openPopup();
  //     })
  // );
});