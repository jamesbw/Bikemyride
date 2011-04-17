function countLegs(request_string){

	var result =2;
	var request = JSON.parse(request_string);

	var waypoints = request.waypoints;
	for(var i=0;i<waypoints.length;i++){
		if(waypoints[i].stopover == true) result ++;
	}

	return result;
}


$(function(){
	
	$("#save-route").val("Update route");


	var request = $("#ride_route").val();

	add_needed_locations(directionsRenderer);

	use_saved_request(directionsRenderer, request);



	//returns the number of legs from a request string. It counts the number of waypoints with stopover= true +2

	function add_needed_locations(dirRenderer){
		// numLegs = dirRenderer.directions.routes[0].legs.size;
		var numLegs = countLegs(request);

		for(var i =2; i<numLegs; i++){
			add_location();
		}
	}
});
