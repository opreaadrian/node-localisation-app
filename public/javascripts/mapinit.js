;(function(window, document, undefined) {

  'use strict';

  var map;
  function initialize() {
    var mapOptions = {
      zoom: 8,
      center: new google.maps.LatLng(-34.397, 150.644),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var mapCanvas = document.querySelector('.map-canvas');
    map = new google.maps.Map(mapCanvas, mapOptions);
  }

  google.maps.event.addDomListener(window, 'load', initialize);

})(window, document);
