  function initialize() {
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
      zoom: 8,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.HYBRID,
      streetViewControl: false,
      zoomControlOptions: { style: google.maps.ZoomControlStyle.DEFAULT}
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
  }
