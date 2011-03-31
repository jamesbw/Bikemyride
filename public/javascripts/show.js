var maps=[];
var directionsRenderers=[];
var directionsService = new google.maps.DirectionsService();

$(function(){

	// var size = $(".ride").size();
	// for(var i =0;i<size; i++){
	// 	$(".ride:eq("+i+")").prepend("<h2>Loaded stuff</h2>");
	// 	$(".ride:eq("+i+")").append('<div id="map'+i+'" class="map round"></div>');
	// 	initialize(i);
	// }
	// $(".rides").accordion({
	// 	collapsible: true,
	// 	autoHeight: false,
	// });


	// var count = 0;

	//Make the accordion
	$(".rides").accordion({
		collapsible: true,
		autoHeight: false,
		changestart: function(event,ui){
			console.log("changestart");
			console.log("index=" + (ui.newContent.index()/2-.5));
			if(ui.newContent.size()>0 && !ui.newContent.hasClass("loaded")){
				var ride_id = ui.newContent.attr("id");
				console.log(ride_id);
				ui.newContent.load('/rides/show_summary/'+ride_id,function(){
					initialize(ride_id);
					ui.newContent.addClass("loaded");
					$(".rides").trigger("accordionchange");
				});
				console.log("pausing");
				// console.log(ui.newContent);
				// ui.newContent.prepend("<h2>Loaded stuff</h2>");
				// ui.newContent.append('<div id="map'+(ui.newContent.index()/2-.5)+'" class="map left round"></div>');
				// while(!document.getElementById('map'+ride_id)){setTimeout("console.log('waiting for html to load');",100);};
				// setTimeout("initialize("+ride_id+")",500);
				// $(function(){ initialize(ride_id)});
				// count++;
			}
		},
		change: function(event,ui){
			console.log("change");
			if(ui.newContent.size()>0 && ui.newContent.hasClass("loaded")){
				var ride_id = ui.newContent.attr("id");
				console.log("attempting to resize map"+ride_id);
				
				// while(!maps[ride_id]){setTimeout("console.log('waiting for map to load');",100);};
				google.maps.event.trigger(maps[ride_id], 'resize');
				// setTimeout("google.maps.event.trigger(maps["+ride_id+"], 'resize');",1000);
			}
		},
	});

	$(".rides").accordion("activate",false);



});

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
  console.log('looking for map'+map_index);
	if(document.getElementById('map'+map_index)){
		$("#map"+map_index).toggle();

		console.log("map found");
		maps[map_index] = new google.maps.Map(document.getElementById('map'+map_index), mapOptions);
		// eval("map"+map_index+ = new google.maps.Map(document.getElementById('map'+map_index), mapOptions);")
	}

	var rendererOptions = {
		draggable: false,
		map: maps[map_index],
	};

	directionsRenderers[map_index]= new google.maps.DirectionsRenderer(rendererOptions);

	var request = $("#"+map_index).children(".route").html();
	// var request = ' {"origin":"sf","destination":"pt reyes","waypoints":[]} ';
	console.log("#map"+map_index+" > .route");
	console.log("request:"+request);

	use_saved_request(directionsRenderers[map_index], request);

	bikeLayer = new google.maps.BicyclingLayer();
  bikeLayer.setMap(maps[map_index]);

  google.maps.event.trigger(maps[map_index], 'resize');

  $("#map"+map_index).toggle();
  $(".route").remove();
}