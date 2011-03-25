var maps=[]

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
				console.log(ui.newContent);
				ui.newContent.prepend("<h2>Loaded stuff</h2>");
				ui.newContent.append('<div id="map'+(ui.newContent.index()/2-.5)+'" class="map left round"></div>');
				initialize((ui.newContent.index()/2-.5));
				// count++;
				ui.newContent.addClass("loaded");
			}
		},
		change: function(event,ui){
			console.log("change");
			if(ui.newContent.size()>0 && ui.newContent.hasClass("loaded")){
				google.maps.event.trigger(maps[(ui.newContent.index()/2-.5)], 'resize');
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
	if(document.getElementById('map'+map_index)){
	maps[map_index] = new google.maps.Map(document.getElementById('map'+map_index), mapOptions);
		// eval("map"+map_index+ = new google.maps.Map(document.getElementById('map'+map_index), mapOptions);")
	}
}