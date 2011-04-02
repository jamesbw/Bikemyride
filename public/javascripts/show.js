var maps=[];
var directionsRenderers=[];
var directionsService = new google.maps.DirectionsService();

$(function(){


	//Make the accordion
	$(".rides").accordion({
		collapsible: true,
		autoHeight: false,
		active: false,
		changestart: function(event,ui){
			// if the accordion is expanding (not contracting) and the content hasn't been loaded yet
			if(ui.newContent.size()>0 && !ui.newContent.hasClass("loaded")){

				var ride_id = ui.newContent.attr("id"); //get the id of the ride to look for

				//load view through ajax request. Call back function to run only once content has been loaded.
				ui.newContent.load('/rides/show_summary/'+ride_id,function(){
					initialize(ride_id);
					ui.newContent.addClass("loaded");
					// google.maps.event.trigger(maps[ride_id], 'resize');
				});
			}
		},
		change: function(event,ui){

			//if the accordion is expanding (not contracting) and the content has already been loaded
			if(ui.newContent.size()>0 && ui.newContent.hasClass("loaded")){
				var ride_id = ui.newContent.attr("id");
				google.maps.event.trigger(maps[ride_id], 'resize');
			}
		},
	});




});


//Creates map
//Creates directionsRenderer
//Runs directions request
function initialize(map_index){

	var latlng = new google.maps.LatLng(37.77493, 	-122.41942);
  var mapOptions = {
    zoom: 13,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false,
    zoomControlOptions: { style: google.maps.ZoomControlStyle.DEFAULT},
    disableDoubleClickZoom: false,
  };

	if(document.getElementById('map'+map_index)){

		//hide the map while it loads
		$("#map"+map_index).toggle();

		//create new map and add to map array
		maps[map_index] = new google.maps.Map(document.getElementById('map'+map_index), mapOptions);
	}

	//these maps are non-draggable
	var rendererOptions = {
		draggable: false,
		map: maps[map_index],
	};

	//one directionsRenderer must be created for each map
	directionsRenderers[map_index]= new google.maps.DirectionsRenderer(rendererOptions);

	//makes sure the map is not hidden once the directions are changed
	google.maps.event.addListener(directionsRenderers[map_index],"directions_changed",function(){
		directionsRenderers[map_index].getMap().getDiv().style.display= 'block';
		google.maps.event.trigger(maps[map_index], 'resize');
	});

	//get request from hidden JSON route
	var request = $("#"+map_index).children(".route").html();

  //remove hidden JSON route
  $(".route").remove();

  //decipher JSON request and load it. See application.js for implementation.
	use_saved_request(directionsRenderers[map_index], request);

	bikeLayer = new google.maps.BicyclingLayer();
  bikeLayer.setMap(maps[map_index]);

  // google.maps.event.trigger(maps[map_index], 'resize');

  // $("#map"+map_index).toggle();


}