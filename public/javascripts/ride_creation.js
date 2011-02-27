var map;
var directionsRenderer;
var directionsService = new google.maps.DirectionsService();

$(function(){
	initialize();
	$("#sortable").sortable({handle: ".handle"});
	$("#sortable").bind("sortupdate",function(){
		relabel_locations();
	});
	
	
	$("input").hover(function(){
		$(this).addClass("ui-state-hover");
	}, function(){
		$(this).removeClass("ui-state-hover");
	});

	$("#calc_route").click(function(){calculate_route();});

	// $(".delete").mousedown(function(){
	// 	$(this).addClass("ui-state-active");
	// });
 	add_properties_to_destination_lis();

	$("#new_location").click(function(){
		if($("#sortable li").length == 10){
			return false;
		}
		else{
			$("#sortable").append('<li class="ui-state-default round"><span class="handle">D. </span><input class="ui-state-default" type="text" value=""></input> <span class="delete">&#10008;</span></li>');
			$("#sortable li:last input").focus();
			add_properties_to_destination_lis();
			relabel_locations();
			if($("#sortable li").length == 10){
				$("#new_location").addClass("ui-state-disabled");
			}
			return false;
		}
	});


});

function relabel_locations(){
	var LABELS = ['A','B','C','D','E','F','G','H','I ','J']
	$("#sortable li").each(function(index){
		$(this).find(".handle").text(LABELS[index]+'. ');
	});
}

function add_properties_to_destination_lis(){
	$(".delete").click(function(){
		if($("#sortable").children().length>2){
			$(this).parent().remove();
			$("#new_location").removeClass("ui-state-disabled");
			relabel_locations();
			return false;
		}
		else{return false}
	});
	
	$("input").hover(function(){
		$(this).addClass("ui-state-hover");
	}, function(){
		$(this).removeClass("ui-state-hover");
	});
}


function calculate_route(){
	var start= $("#sortable li:first input").val();
	var end = $("#sortable li:last input").val();
	var waypts= $("#sortable li:not(:first,:last) input").map(function(){
		return {location: this.value, stopover: true};
	}).get();


	// console.log(start + " " + end	);
	// console.log(waypts[0].location + " " +waypts[1].stopover);

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
      update_location_fields();
    }
    else {alert("something went wrong")}
	});

}

function update_location_fields(){
	var legs = directionsRenderer.directions.routes[0].legs;
	for( var i=0; i<legs.length; i++){
		$("#sortable li input")[i].value =legs[i].start_address;
		$("#sortable li input")[i+1].value =legs[i].end_address;
	}
}

function initialize(){
	
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
		suppressBicyclingLayer: true,
	};

	directionsRenderer= new google.maps.DirectionsRenderer(rendererOptions);
	google.maps.event.addListener(directionsRenderer,"directions_changed",function(){
		update_location_fields();
	});
}