var map = null;
var directionsRenderer = null;
var directionsService = new google.maps.DirectionsService();
var elevationService = new google.maps.ElevationService();
var SAMPLES = 256;
var elevationChart = null;
var distanceInMeters = 0;
var distanceInMiles = 0;
var elevationsInMeters=[];
var elevationsInFeet=[];
var mousemarker = null;
var grades =[]; //grades from -100 to 100 (%)
var elevations =[]; //array of google elevation objects. they contain location and elevation


//does some dynamic resizing, especially for when window is resized
function resize_elements(){
	
	var search_bar_width = $("#search_bar").outerWidth(true);//true: include margin
	var sidebar_width = $(".sidebar").outerWidth(true);
	var section_width = $("section").width();
	var middle_column_width = section_width - search_bar_width - sidebar_width -50
	$("#middle_column").width(middle_column_width);
	$("#map").height($("#map").width()*9/16);
	$("#title_desc_wrapper").width(middle_column_width);

	//make ride description resizable from the bottom, and scale other items with it
	$("#ride_description").resizable({
		handles: 's',
		resize: function(){
			$("#save-route-area").height($("#title_desc_wrapper").outerHeight()); 
			$(".sidebar").height( $("#main_bar").height());
			$("#ride_description").width($("#ride_title").width());
			$("#ride_description").addClass("ui-state-hover");
		},

	});

	//maintain the hover effect on the text area when resizing
	$(".ui-resizable-handle").hover(function(){
			$("#ride_description").addClass("ui-state-hover");
		}, function(){
			$("#ride_description").removeClass("ui-state-hover");
	});


	$("#save-route-area").width(search_bar_width-20).height($("#title_desc_wrapper").outerHeight());
	$(".sidebar").height( $("#main_bar").height());
	var title_desc_wrapper_width = $("#title_desc_wrapper").width();
	$("#ride_description").width(title_desc_wrapper_width*0.9);
	$("#ride_description").parent('.ui-wrapper').width(title_desc_wrapper_width*0.9+50);
	$("#ride_title").width(title_desc_wrapper_width*0.9);

}

$(function(){


	resize_elements();
	$(window).resize(function() {
		resize_elements();
	});

	//allow to toggle the first fieldset
	$(".togglable legend").click(function(){
		$(this).siblings().slideToggle();
	});

	//Set up map and renderer
	initialize_map();


	//Make route_form submit by Ajax
	$("#route_form").submit(function(){
		calculate_route();
		return false;
	});


	//Make unordered list sortable by jQuery UI. The letter before the input text field is the handle.
	//On re-sort, the labels are updated and the route recalculated.
	//The re-calc is only done if the dragged item has a non-empty location. This is because all empty locations get deleted when the route is calculated.
	$("#sortable").sortable({handle: ".handle"});
	$("#sortable").bind("sortupdate",function(e,ui){
		relabel_locations();
		if(ui.item.find("input").val() !=""){
			calculate_route();	
		}
	});


	//Bind the route calculation to its button
	$("#calc_route").click(function(){calculate_route();return false;});

  //Add properties to initial list items (li). When new items are added, this function will be called again.
 	add_properties_to_destination_lis();


 	//The Add Location button will add a line item to #sortable if there are fewer than 10.
	$("#new_location").click(function(){
		add_location();
		return false;
	});


});


//Adds a line item to #sortable if there are fewer than 6.
//When there are six, the button is disabled.
//Every time a list item is added, the properties have to be set on this item. Currently all the line items are reset (inefficient but okay).
function add_location(){
	if($("#sortable li").length < 6){
		$("#sortable").append('<li class="ui-state-default round"><span class="handle">D. </span><input class="ui-state-default" type="text" value=""></input> <span class="delete">&#10008;</span></li>');
		$("#sortable li:last input").focus();
		add_properties_to_destination_lis();
		relabel_locations();
		if($("#sortable li").length == 6){
			$("#new_location").addClass("ui-state-disabled");
		}
	}
}

//This is called when the #sortable list gets shuffled. Notice the space after 'I' to make spacing more consistent.
function relabel_locations(){
	var LABELS = ['A','B','C','D','E','F','G','H','I ','J']
	$("#sortable li").each(function(index){
		$(this).find(".handle").text(LABELS[index]+'. ');
	});
}

//The properties to be added are: delete button, hovering, handling ENTER
function add_properties_to_destination_lis(){


	//delete: enabled if there are more than 2 locations
	//re-enables the Add Location button in case it was disabled
	//re-labels each line item
	//re-calcs the route
	$(".delete").click(function(){
		if($("#sortable").children().length>2){
			$(this).parent().remove();
			$("#new_location").removeClass("ui-state-disabled");

			relabel_locations();
			calculate_route();
		}
	});

}

//Deletes empty locations, sends request to Google and feeds it to the renderer.
//The location fields get updated with the response addresses.
function calculate_route(){


	//clear empty locations
	$("#sortable li").each(function(){
		if ($(this).find("input").val()=="" && $("#sortable li").length >2){
			$(this).remove();
			$("#new_location").removeClass("ui-state-disabled");
		}
	});
	relabel_locations();

	
	var start= $("#sortable li:first input").val();
	var end = $("#sortable li:last input").val();
	var waypts= $("#sortable li:not(:first,:last) input").map(function(){
		return {location: this.value, stopover: true};
	}).get();


	var request = {
        origin: start, 
        destination: end,
        waypoints: waypts,
        optimizeWaypoints: false,
        travelMode: google.maps.DirectionsTravelMode.BICYCLING,
    };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
    	console.log("got response");
      directionsRenderer.setDirections(response);

      


      // update_location_fields();

    }
    else {alert("something went wrong")}
	});

//In case error messages from map saving were still there, hide them.
	$("#error_explanation").hide();


}

//Replaces the locations with the nicer and fuller addresses returned by Google
function update_location_fields(){
	var legs = directionsRenderer.directions.routes[0].legs;
	for( var i=0; i<legs.length; i++){
		$("#sortable li input")[i].value =legs[i].start_address;
		$("#sortable li input")[i+1].value =legs[i].end_address;
	}
}


//Set up the map. Create the renderer
function initialize_map(){
	
	$("#graph").hide();
	$(".sidebar").height( $("#main_bar").height());

	//Map options
	
	var latlng = new google.maps.LatLng(37.77493, 	-122.41942);
    var mapOptions = {
      zoom: 13,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      zoomControlOptions: { style: google.maps.ZoomControlStyle.DEFAULT},
      disableDoubleClickZoom: false,
    };
    
	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	var rendererOptions = {
		draggable: true,
		map: map,
	};

	directionsRenderer= new google.maps.DirectionsRenderer(rendererOptions);

	//Update the location fields if the markers are dragged on the map.
	//Update the hidden form that will save the route.
	//Update elevation and graph
	//Update distances
	google.maps.event.addListener(directionsRenderer,"directions_changed",function(){
		update_location_fields();
		update_hidden_form();
		update_elevation();
		update_distances();
	});

	//Add the bike layer
	var bikeLayer = new google.maps.BicyclingLayer();
  bikeLayer.setMap(map);
}

function update_hidden_form(){
	$("#ride_route").val(request_to_be_saved());
	console.log("hidden form has been updated");
}

//Generates a JSON-serialized string to be stored in the database.
//For example: {"origin":"San Francisco, CA, USA","destination":"Point Reyes, Northwest Marin, CA 94956, USA","waypoints":[{"location":"sausalito","stopover":true},{"location":"(38.11682094472847, -122.5699073486328)","stopover":false}]}
//toString is applied to all locations. Locations in the API can be either a string or a LatLng object. toString on a LatLng object returns a usable string for a geocoding request.
//Travel mode and waypoint optimization are not saved because assumed to be Bicycling and False always.
function request_to_be_saved(){


	var directions_holder = directions_subobject_Mf();


	var orig = directions_holder.origin.toString();
	var dest = directions_holder.destination.toString();
	var waypts = [];

	for(var i = 0; i < directions_holder.waypoints.length; i++){
		var wpt = {
								location: directions_holder.waypoints[i].location.toString(),
								stopover: directions_holder.waypoints[i].stopover,
							};
		waypts.push(wpt);
	}

	var request = {
      origin: orig, 
      destination: dest,
      waypoints: waypts,
  };

  return JSON.stringify(request);
}


//Returns a reference to the subobject of directionsRenderer that contains the request info. This function is necessary because the google naming changes constantly.
// For instance, this object used to be accessible through directionsRenderer.directions.Mf.origin, but Mf changed to Jf today.
function directions_subobject_Mf(){

	var dir = directionsRenderer.directions;

	var directions_subobject;
	for(var property in dir){
		if(dir[property].origin){
			directions_subobject=dir[property];
			break;			
		}
	}
	return directions_subobject;
}

//runs the elevation request to google
function update_elevation(){
	console.log("updating elevation");
	elevationService.getElevationAlongPath({
    path: directionsRenderer.directions.routes[0].overview_path,
    samples: SAMPLES,
  }, plotElevation);
  $("#graph").show(); //display the graph div when elevations have been calculated
  $(".sidebar").height( $("#main_bar").height()); //graph has been added, so the sidebar must be resized
}

//Updates the elevation arrays and creates the Highcharts graph
function plotElevation(results){
	elevations = results; //updates elevations array
	elevationsInMeters =[]; //empty this array, ready for pushes
	grades =[];
	for( var i = 0; i < results.length; i++){
		elevationsInMeters.push(Math.max(results[i].elevation,0)); //floor at 0 (GG Bridge is negative, screw death valley for now)
	}
	grades =getGrades(elevationsInMeters, distanceInMeters);

	elevationsInFeet = elevationsInMeters.map(metersToFeet);

//See HighCharts API reference for details
	elevationChart = new Highcharts.Chart({
		chart: {
		  renderTo: 'graph',
		  defaultSeriesType: 'area'
		},
		title: {
		  text: null
		},
		xAxis: {
			title: {
		     text: 'Distance (miles)',
			  },
		},
		yAxis: {
		  title: {
		     text: 'Elevation (ft)',
			  },
	    startOnTick: false,
	    endOnTick: false,
		},
		tooltip: {
			shared: true,
			formatter: function() {

						//taking advantage of this event to update moving marker on map
						var index = Math.round(this.x/(distanceInMiles/SAMPLES));
	    			      if (mousemarker == null) {
							        mousemarker = new google.maps.Marker({
							          position: elevations[index].location,
							          map: map,
							          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
							        });
							      } else {
							        mousemarker.setPosition(elevations[index].location);
							      }
            return "Elevation: "+Highcharts.numberFormat(this.points[0].y,0)+" ft <br/> Grade: "+Highcharts.numberFormat(grades[index],0)+"%";
         },
		},
		plotOptions: {
         area: {
         		pointStart: 0,
         		pointInterval: distanceInMiles/SAMPLES,
            marker: {
               enabled: false,
               symbol: 'circle',
               radius: 2,
               states: {
                  hover: {
                     enabled: true
                  }
               }
            },
            events: {
            	mouseOut: function(){
            			mousemarker.setMap(null);
            			mousemarker = null;
            		}
            },
         },
      },
		series: [{
		  showInLegend: false,
		  data: elevationsInFeet,
		  id: 'elevations',
		}]
  });
}

//iterates on the legs of the route to get total distance
function getDistanceInMeters(dirRenderer){
	var distance = 0;
	var numLegs = dirRenderer.getDirections().routes[0].legs.length;
	for( var i=0; i <numLegs; i++){
		distance += dirRenderer.getDirections().routes[0].legs[i].distance.value
	}
	return distance;
}

//iterates on the legs of the route to get total duration
function  getDurationInSeconds(dirRenderer){
	var duration = 0;
	var numLegs = dirRenderer.getDirections().routes[0].legs.length;
	for( var i=0; i <numLegs; i++){
		distance += dirRenderer.getDirections().routes[0].legs[i].duration.value
	}
	return duration;
}

function getGrades(elevationsArray, totalDistance){
	var grades =[];
	grades.push(0);
	for( var i=1; i< elevationsArray.length -1; i++){
		grades.push((elevationsArray[i+1]-elevationsArray[i-1])/(2*totalDistance/elevationsArray.length)*100);
	}
	grades.push(0);
	return grades;
}

function metersToFeet(dist){
	return dist/.305;
}

function update_distances(){
	distanceInMeters = getDistanceInMeters(directionsRenderer);
	distanceInMiles  = distanceInMeters / 1609;
}