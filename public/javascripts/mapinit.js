/* globals google */
// Extra ; in order to prevent concatenation errors when combining with third party plugins
;(function(window, document, google, undefined) {

  'use strict';

  /** Check for geolocation support in an optimal manner*/
  var hasGeolocation = 'geolocation' in window.navigator;

  /** Return early and save some extra calls if geolocation API is unsupported */
  if (!hasGeolocation) {

    throw new Error('Operation not supported: geolocation unavailable.');

  }

  navigator.geolocation.getCurrentPosition(function(position) {

    initializeMap(position.coords);

  });

  function _handleMapMouseDown(evt) {
    evt.target.addEventListener('mousemove', _handleMapMouseMove, false);
    evt.target.addEventListener('mouseup', _handleMapMouseUp, false);
  }

  function _handleMapMouseMove(evt) {
    document.querySelector('.login-panel').classList.add('translucent');
  }

  function _handleMapMouseUp(evt) {
    document.querySelector('.login-panel').classList.remove('translucent');
    evt.target.removeEventListener('mousemove', _handleMapMouseMove);
  }
  /**
   * @method initializeMap
   *
   * @description Initializes the google map constructor with the user's current position
   *
   * @param {object} coords The coordinates object, containing the user's position specified in
   * terms of latitude / longitude -- obtained from HTML5 geolocation API
   */
  function initializeMap(coords) {
    var mapOptions = {},
      mapCanvas = null,
      map = null,
      geocoder = null,
      coordinateSystemSelect = document.querySelector('#coordinate-system'),
      latLng = new google.maps.LatLng(coords.latitude, coords.longitude),
      coordinatesView = document.querySelector('.coordinates-view'),
      locationInfo = document.querySelector('.location-info');

    coordinatesView.innerHTML = '<strong>Latitude</strong>: <span>' +
                                coords.latitude + '</span><br>'+
                                '<strong>Longitude</strong>: <span>' +
                                coords.longitude + '</span>';

    mapOptions = {
      zoom: 17,
      center: latLng,
      /**
       * HACK: This is here for testing purposes and should be added conditionally based on the page
       * where the map is actually loaded (currently added for "index" page)
       */
      disableDefaultUI: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    mapCanvas = document.querySelector('.map-canvas');

    mapCanvas.addEventListener('mousedown', _handleMapMouseDown, false);

    map = new google.maps.Map(mapCanvas, mapOptions);

    geocoder = new google.maps.Geocoder();

    geocoder.geocode({
      latLng: latLng
    }, function(results, status) {

      if (status == google.maps.GeocoderStatus.OK) {
        if (results && results.length) {


          locationInfo.innerHTML = '<strong>Approximate address</strong><span> ' +
                                    results[0].formatted_address + '</span><br>' +
                                    '<strong>County</strong><span> ' +
                                    results[0].address_components[4].long_name +
                                    '(' + results[0].address_components[4].short_name + ')</span>';
        }
      }
    });

    function calculateDMS() {
      var latDegrees = 0,
          latMinutes = 0,
          latSeconds = 0,
          longDegrees = 0,
          longMinutes = 0,
          longSeconds = 0,
          intermediaryUnit = 0;

      latDegrees = parseInt(coords.latitude, 10);
      intermediaryUnit = (coords.latitude % 1 * 60);
      latMinutes = parseInt(intermediaryUnit, 10);
      latSeconds = intermediaryUnit % 1 * 60;
      longDegrees = parseInt(coords.longitude, 10);
      intermediaryUnit = (coords.longitude % 1 * 60);
      longMinutes = parseInt(intermediaryUnit, 10);
      longSeconds = intermediaryUnit % 1 * 60;

      coordinatesView.innerHTML = '<strong>Latitude</strong>: ' + latDegrees +
                                '&deg; ' + latMinutes + '" ' +
                                latSeconds + '\'' + '</strong><br>' +
                                '<strong>Longitude</strong>: ' +
                                longDegrees + '&deg; ' +
                                longMinutes + '" ' +
                                longSeconds + '\'';
    }

    function addLatLng() {
      coordinatesView.innerHTML = '<strong>Latitude</strong>: <span>' +
                                  coords.latitude + '</span><br>'+
                                  '<strong>Longitude</strong>: <span>' +
                                  coords.longitude + '</span>';
    }

    coordinateSystemSelect.addEventListener('change', function(e) {
      switch (e.target.value) {
        case 'dms':
          calculateDMS();
          break;
        case 'latlng':
          addLatLng();
          break;


      }
    }, false);
    initializeInfoPanel(map, coords);
  }

  /**
   * @method initializeInfoPanel
   *
   * @description Initializes the info panel containing details about the user's position.
   *
   * @param {object} map The map object generated by initializeMap
   * @param {object} coords The coordinates object, specifying the current position of our user
   */
  function initializeInfoPanel(map, coords) {
    var infoWindow,
      pos = null,
      marker = null;

    pos = new google.maps.LatLng(coords.latitude, coords.longitude);


    marker = new google.maps.Marker({
      map: map,
      position: pos,
      title: 'You are here'
    });

    infoWindow = new google.maps.InfoWindow({
      content:
        (window.userProfileImage ? '<div><img class="profile-image img-thumbnail img-circle" src="' + window.userProfileImage +'"></div>' : '') +
        '<strong>Latitude: </strong>' +
        coords.latitude +
        '<br> <strong>Longitude: </strong> ' +
        coords.longitude +
        '<br><br>' +
        '<button class="more-info btn btn-info" data-toggle="modal" data-target="#myModal">Detailed info</button>',
      maxWidth: 200
    });

    infoWindow.open(marker.get('map'), marker);

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(marker.get('map'), marker);
    });

    map.setCenter(pos);
  }

})(window, document, google);
