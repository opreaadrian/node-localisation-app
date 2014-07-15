/* globals google, io, _*/
var socket         = io.connect('http://localhost:8080/'),
    casesContainer = document.querySelector('.cases');

socket.on('connected', function(data) {
  'use strict';
  console.log(data);
  socket.on('case:registered', function(data) {
    console.log('New case registered %o', data);

    var caseTemplate = $('#case-template').text(),
        tmpl = _.template(caseTemplate);

    casesContainer.innerHTML += tmpl(data);
  });

});

function initializeCaseMap(caseData) {
  'use strict';

  var infoWindow = null,
      pos        = null,
      marker     = null;

  var mapOptions = {
      zoom             : 17,
      center           : new google.maps.LatLng(caseData.coordinates.latitude, caseData.coordinates.longitude),
      /**
       * HACK: This is here for testing purposes and should be added conditionally based on the page
       * where the map is actually loaded (currently added for "index" page)
       */
      disableDefaultUI : false,
      mapTypeId        : google.maps.MapTypeId.ROADMAP
    };
    

  var mapCanvas = document.querySelector('.map-canvas');

  var map = new google.maps.Map(mapCanvas, mapOptions);
  pos = new google.maps.LatLng(caseData.coordinates.latitude, caseData.coordinates.longitude);


  marker = new google.maps.Marker({
    map      : map,
    position : pos,
    title    : 'You are here'
  });

  infoWindow = new google.maps.InfoWindow({
    content:
      (caseData.isAuthenticated ? '<div><img class="profile-image img-thumbnail img-circle" src="' + caseData.profileImage +'"></div>' : '') +
      '<strong>Latitude: </strong>' +
      caseData.coordinates.latitude +
      '<br> <strong>Longitude: </strong> ' +
      caseData.coordinates.longitude +
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

  map.setCenter(pos);
}

casesContainer.addEventListener('click', function(e) {
  'use strict';

  if (e.target.nodeName == 'BUTTON') {
    console.log(e.target.dataset.caseInfo);
    
    var caseData = JSON.parse(decodeURIComponent(e.target.dataset.caseInfo));

    initializeCaseMap(caseData);
  }
}, false);


