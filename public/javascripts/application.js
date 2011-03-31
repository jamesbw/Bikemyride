// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults


	//Change ui state on hover

	$(function(){		
		$(".ui-state-default").hover(function(){
			$(this).addClass("ui-state-hover");
		}, function(){
			$(this).removeClass("ui-state-hover");
		});
	});



//Common map functions	

//Builds the request object from the serialized string.
//request format for directionsService is
// var request = {
//       origin: start, 
//       destination: end,
//       waypoints: waypts,
//       optimizeWaypoints: false,
//       travelMode: google.maps.DirectionsTravelMode.BICYCLING,
//   };
function build_request(request_string){

	var request = JSON.parse(request_string);

	request.optimizeWaypoints = false;
	request.travelMode = google.maps.DirectionsTravelMode.BICYCLING;

	return request;

}


//Just a test function to see if the saving and loading of the path works.
// Now used to load the maps in the profiles
function use_saved_request(dirRenderer, request){
	directionsService.route(build_request(request), function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
    	console.log("got response");
      dirRenderer.setDirections(response);

      


      // update_location_fields();
    }
    else {alert("something went wrong")}
	});
}