/* globals google, _, io, user */
// Extra ; in order to prevent concatenation errors when combining with third party plugins
var ApplicationMap = (function(window, document, google, _, undefined) {
'use strict';

_.templateSettings = {
  evaluate: /\{\{(.+?)\}\}/g,
  interpolate: /\{\{=(.+?)\}\}/g,
  escape: /\{\{-(.+?)\}\}/g
};

function getGeoPosition(){
  /** Check for geolocation support in an optimal manner*/
  var hasGeolocation = 'geolocation' in window.navigator;

  /** Return early and save some extra calls if geolocation API is unsupported */
  if (!hasGeolocation) {

    throw new Error('Operation not supported: geolocation unavailable.');

  }

  navigator.geolocation.getCurrentPosition(function(position) {

    initializeMap(position.coords);

  });
}

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
  var mapOptions             = {},
      mapCanvas              = null,
      map                    = null,
      geocoder               = null,
      coordinateSystemSelect = document.querySelector('#coordinate-system'),
      latLng                 = new google.maps.LatLng(coords.latitude, coords.longitude);

    mapOptions = {
      zoom             : 17,
      center           : latLng,
      /**
       * HACK: This is here for testing purposes and should be added conditionally based on the page
       * where the map is actually loaded (currently added for "index" page)
       */
      disableDefaultUI : false,
      mapTypeId        : google.maps.MapTypeId.ROADMAP
    };

    mapCanvas = document.querySelector('.map-canvas');

    if (document.querySelector('.login-panel')) {
      mapCanvas.addEventListener('mousedown', _handleMapMouseDown, false);
    }

    map       = new google.maps.Map(mapCanvas, mapOptions);

    getApproximateAddress(latLng);

    changeCoordinateSystem('latlng', coords.latitude, coords.longitude);

    coordinateSystemSelect.addEventListener('change', function(e) {
      changeCoordinateSystem(e.target.value, coords.latitude, coords.longitude);
    }, false);
    initializeInfoPanel(map, coords);
  }

  function updateCoordinatesView(data) {
    var coordinatesView = document.querySelector('.coordinates-view'),
        template        = null;

    switch (data.coordSystem) {
      case 'dms':
        template = _.template($('#coordinates-dms').text());
        coordinatesView.innerHTML =  template(data);
        break;
      case 'latlng':
        template = _.template($('#coordinates-latlng').text());
        coordinatesView.innerHTML =  template(data);
        break;
    }
  }

  function calculateDMS(latitude, longitude) {
    var latDegrees       = 0,
        latMinutes       = 0,
        latSeconds       = 0,
        longDegrees      = 0,
        longMinutes      = 0,
        longSeconds      = 0,
        intermediaryUnit = 0;

    latDegrees       = parseInt(latitude, 10);
    intermediaryUnit = (latitude % 1 * 60);
    latMinutes       = parseInt(intermediaryUnit, 10);
    latSeconds       = intermediaryUnit % 1 * 60;
    longDegrees      = parseInt(longitude, 10);
    intermediaryUnit = (longitude % 1 * 60);
    longMinutes      = parseInt(intermediaryUnit, 10);
    longSeconds      = intermediaryUnit % 1 * 60;

    return {
      coordSystem: 'dms',
      latitude : {
        degrees: latDegrees,
        minutes: latMinutes,
        seconds: latSeconds
      },
      longitude: {
        degrees: longDegrees,
        minutes: longMinutes,
        seconds: longSeconds
      }
    };

  }

  function addLatLng(latitude, longitude) {
    return {
      coordSystem: 'latlng',
      latitude : latitude,
      longitude: longitude
    };
  }

  function changeCoordinateSystem(targetSystem, latitude, longitude) {
      switch (targetSystem) {
        case 'dms'    :
          var dms = calculateDMS(latitude, longitude);
          updateCoordinatesView(dms);
          break;
        case 'latlng' :
          var latlng = addLatLng(latitude, longitude);
          updateCoordinatesView(latlng);
          break;
        default:
          addLatLng(latitude, longitude);
          updateCoordinatesView(latlng);
    }
  }

  function getApproximateAddress(latLng) {
    var geocoder  = new google.maps.Geocoder();
    geocoder.geocode({
      latLng : latLng
    }, function(results, status) {

      if (status == google.maps.GeocoderStatus.OK) {
        if (results && results.length) {
          updateLocationInfo(results[0]);
        }
      }
    });
  }

  function updateLocationInfo(data) {
    var locationInfo = document.querySelector('.location-info');

    locationInfo.innerHTML = '<strong>Approximate address</strong><span> ' +
                              data.formatted_address + '</span><br>' +
                              '<strong>County</strong><span> ' +
                              data.address_components[4].long_name +
                              '(' + data.address_components[4].short_name + ')</span>';
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
    var infoWindow = null,
        pos        = null,
        marker     = null;

    pos = new google.maps.LatLng(coords.latitude, coords.longitude);


    marker = new google.maps.Marker({
      map      : map,
      position : pos,
      title    : 'You are here'
    });

    infoWindow = new google.maps.InfoWindow({
      content:
        (window.user && window.user.isAuthenticated ? '<div><img class="profile-image img-thumbnail img-circle" src="' + window.user.profileImage +'"></div>' : '') +
        '<strong>Latitude: </strong>' +
        coords.latitude +
        '<br> <strong>Longitude: </strong> ' +
        coords.longitude +
        '<br><br>' +
        '<button class="more-info btn btn-info" data-toggle="modal" data-target="#details-panel">Detailed info</button>' +
        '<button class="get-help btn btn-danger" data-toggle="modal" data-target="#get-help">Get help</button>',
      maxWidth: 300
    });


    // var sendMessageButton = document.querySelector('#send-message');

    // sendMessageButton.addEventListener('click', function(e) {
    //   e.preventDefault();
    //   debugger;
    // }, false);

    infoWindow.open(marker.get('map'), marker);

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(marker.get('map'), marker);
    });

    initializeFormListener(coords);

    map.setCenter(pos);
  }

  function initializeFormListener(coords /* the LAT/LNG coordinates object*/) {
    var getHelpForm =  document.querySelector('#get-help-form');

    getHelpForm.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();

      var phoneNumber = e.target.phoneNumber.value;

      if (phoneNumber) {
        // Start realtime communication
        // Create case in administration panel
        // Send details
        // Listen for location changes
        var socket = io.connect('http://localhost:8080/');
        socket.on('connected', function(data) {
          console.log('Connection established %o', data);

          user.coordinates = {
            latitude  : coords.latitude,
            longitude : coords.longitude,
          };
          user.phoneNo = phoneNumber;

          user.caseDetails = encodeURIComponent(JSON.stringify(user));

          socket.emit('emergency', user);
          socket.on('case:registered', function() {
            e.target.innerHTML = 'Your message has been sent!';
          });
        });

      } else {
        // Return an error
        // Stop execution
      }
    }, false);
  }

  return {
    start: getGeoPosition
  };

})(window, document, google, _);
