/* global io */
var socket = io.connect('http://localhost:8080');
socket.on('connected', function(data) {
  'use strict';
    var hasGeo = 'geolocation' in window.navigator;

    function showData(position) {
      console.log(position);
      socket.emit('localized', {coords: position.coords});
    }

    if (hasGeo) {

      navigator.geolocation.getCurrentPosition(showData);

    }
    console.log(data);
});
