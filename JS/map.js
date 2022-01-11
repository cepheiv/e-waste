// Define address variables
var searchLatitude;
var searchLongitude;
var searchval;

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
      heremarker = new L.Marker([searchLatitude, searchLongitude], {bounceOnAdd: true, icon: customMarker}).bindPopup(popup,{minWidth:50}).addTo(map);
      }
      else {
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
                output[i] = data.results[i].ADDRESS
              }
              //console.log(data)
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
  minZoom: 12
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
var binCluster = L.markerClusterGroup({showCoverageOnHover:true, maxClusterRadius:130}).addTo(map);
var bbBinCluster = L.markerClusterGroup({showCoverageOnHover:true, maxClusterRadius:150}).addTo(map);
var batteryBinCluster = L.markerClusterGroup({showCoverageOnHover:true, maxClusterRadius:150}).addTo(map);
var mannedCluster = L.markerClusterGroup({showCoverageOnHover:true, maxClusterRadius:150}).addTo(map);
var nonregCluster = L.markerClusterGroup({showCoverageOnHover:true, maxClusterRadius:150}).addTo(map);
var inktonerCluster = L.markerClusterGroup({showCoverageOnHover:true, maxClusterRadius:150}).addTo(map);
var promise = $.getJSON("./mapdata/ewaste.json");
promise.then(function(data) {
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
      binCluster.addLayer(eBinMarker)
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
        binCluster.addLayer(bbBinMarker)
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
        binCluster.addLayer(batteryBinMarker)
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
        binCluster.addLayer(mannedMarker)
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
        binCluster.addLayer(nonregMarker)
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
        binCluster.addLayer(nonregMarker)
    }
    }
    
    var ict_click = true; // Set to false to show no icons by default
    var bulb_click = true;
    var battery_click = true;
    var nonreg_click = true;
    var inktoner_click = true;

    $("#allBin").click(function() {
    //map.addLayer(eBinlayerGroup)
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

    // Show only ICT layer    
    $("#ict").click(function() {
      if (ict_click == false) {
        // Add eBin and manned layers only
        binCluster.addLayer(eBinlayerGroup)
        binCluster.removeLayer(bbBinlayerGroup)
        binCluster.removeLayer(batteryBinlayerGroup)
        binCluster.addLayer(mannedlayerGroup)
        //binCluster.removeLayer(nonreglayerGroup) // Will not remove nonreg layer
        map.addLayer(binCluster)
        //map.addLayer(eBinlayerGroup)
        //map.addLayer(mannedlayerGroup)
        ict_click = true
      } else if (ict_click == true && bulb_click == true && battery_click == true) {
        // Remove nothing
        // map.removeLayer(mannedlayerGroup)
        ict_click = false
      } else if (ict_click == true && bulb_click == true) {
        // Remove manned layer only
        binCluster.addLayer(eBinlayerGroup)
        binCluster.addLayer(bbBinlayerGroup)
        binCluster.addLayer(batteryBinlayerGroup)
        binCluster.removeLayer(mannedlayerGroup)
        //binCluster.removeLayer(nonreglayerGroup)
        map.addLayer(binCluster)
        //map.removeLayer(mannedlayerGroup)
        ict_click = false
      } else if (ict_click == true && battery_click == true) {
        // Remove nothing
        ict_click = false
      } else if (ict_click == true) {
        // Remove eBin and manned layers only
        binCluster.removeLayer(eBinlayerGroup)
        binCluster.addLayer(bbBinlayerGroup)
        binCluster.addLayer(batteryBinlayerGroup)
        binCluster.removeLayer(mannedlayerGroup)
        //binCluster.addLayer(nonreglayerGroup)
        map.addLayer(binCluster)
        //map.removeLayer(eBinlayerGroup)
        //map.removeLayer(mannedlayerGroup)
        ict_click = false
      }
    })

    // Show only battery and bulb bin layer    
    $("#bulb").click(function() {
      if (bulb_click == false) {
        // Add eBin and bbBin layers only
        binCluster.addLayer(eBinlayerGroup)
        binCluster.addLayer(bbBinlayerGroup)
        binCluster.removeLayer(batteryBinlayerGroup)
        binCluster.removeLayer(mannedlayerGroup)
        //binCluster.removeLayer(nonreglayerGroup)
        map.addLayer(binCluster)
        //map.addLayer(eBinlayerGroup)
        //map.addLayer(bbBinlayerGroup)
        bulb_click = true
      } else if (ict_click == true && bulb_click == true && battery_click == true) {
        // Remove nothing
        bulb_click = false
      } else if (ict_click == true && bulb_click == true) {
        // Remove bulb layer only
        binCluster.addLayer(eBinlayerGroup)
        binCluster.removeLayer(bbBinlayerGroup)
        binCluster.addLayer(batteryBinlayerGroup)
        binCluster.addLayer(mannedlayerGroup)
        //binCluster.removeLayer(nonreglayerGroup)
        map.addLayer(binCluster)
        //map.removeLayer(bbBinlayerGroup)
        bulb_click = false
      } else if (bulb_click == true && battery_click == true) {
        // Remove nothing
        bulb_click = false
      } else if (bulb_click == true) {
        // Remove eBin and bbBin layers only
        binCluster.removeLayer(eBinlayerGroup)
        binCluster.removeLayer(bbBinlayerGroup)
        binCluster.addLayer(batteryBinlayerGroup)
        binCluster.addLayer(mannedlayerGroup)
        //binCluster.addLayer(nonreglayerGroup)
        map.addLayer(binCluster)
        //map.removeLayer(eBinlayerGroup)
        //map.removeLayer(bbBinlayerGroup)
        bulb_click = false
      }
    })

    // Show only battery only bin layer    
    $("#battery").click(function() {
      if (battery_click == false) {
        // Add all layers
        binCluster.addLayer(eBinlayerGroup)
        binCluster.addLayer(bbBinlayerGroup)
        binCluster.addLayer(batteryBinlayerGroup)
        binCluster.addLayer(mannedlayerGroup)
        //binCluster.removeLayer(nonreglayerGroup)
        map.addLayer(binCluster)
        //map.addLayer(eBinlayerGroup)
        //map.addLayer(bbBinlayerGroup)
        //map.addLayer(batteryBinlayerGroup)
        //map.addLayer(mannedlayerGroup)
        battery_click = true
      } else if (ict_click == true && bulb_click == true && battery_click == true) {
        // Remove battery layer only
        binCluster.addLayer(eBinlayerGroup)
        binCluster.addLayer(bbBinlayerGroup)
        binCluster.removeLayer(batteryBinlayerGroup)
        binCluster.addLayer(mannedlayerGroup)
        //binCluster.addLayer(nonreglayerGroup)
        map.addLayer(binCluster)
        //map.removeLayer(batteryBinlayerGroup)
        battery_click = false
      } else if (ict_click == true && battery_click == true) {
        // Remove bulb and battery layers only
        binCluster.addLayer(eBinlayerGroup)
        binCluster.removeLayer(bbBinlayerGroup)
        binCluster.removeLayer(batteryBinlayerGroup)
        binCluster.addLayer(mannedlayerGroup)
        //binCluster.addLayer(nonreglayerGroup)
        map.addLayer(binCluster)
        //map.removeLayer(bbBinlayerGroup)
        //map.removeLayer(batteryBinlayerGroup)
        battery_click = false
      } else if (bulb_click == true && battery_click == true) {
        // Remove battery and manned layers only
        binCluster.addLayer(eBinlayerGroup)
        binCluster.addLayer(bbBinlayerGroup)
        binCluster.removeLayer(batteryBinlayerGroup)
        binCluster.removeLayer(mannedlayerGroup)
        //binCluster.addLayer(nonreglayerGroup)
        map.addLayer(binCluster)
        //map.removeLayer(batteryBinlayerGroup)
        //map.removeLayer(mannedlayerGroup)
        battery_click = false
      } else if (battery_click == true) {
        // Remove all layers
        binCluster.removeLayer(eBinlayerGroup)
        binCluster.removeLayer(bbBinlayerGroup)
        binCluster.removeLayer(batteryBinlayerGroup)
        binCluster.removeLayer(mannedlayerGroup)
        //binCluster.addLayer(nonreglayerGroup)
        map.addLayer(binCluster)
        //map.removeLayer(eBinlayerGroup)
        //map.removeLayer(bbBinlayerGroup)
        //map.removeLayer(batteryBinlayerGroup)
        //map.removeLayer(mannedlayerGroup)
        battery_click = false
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

    // Bind popup to town council boundary layers
    function onEachFeature(feature, layer) {
      // does this feature have a property named TOWN_COUNCIL?
      if (feature.properties && feature.properties.TOWN_COUNCIL) {
        var town_council = feature.properties.TOWN_COUNCIL.replace("TC","TOWN COUNCIL")
          layer.bindTooltip(town_council,{
            //autoClose: true
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
  boundaryLayer();

});
