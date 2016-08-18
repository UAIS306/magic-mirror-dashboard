'use strict';

require('mapbox.js');
var publicKey = require('../../../config/keys-mapbox.json').mapbox.secret;

var renderMap = function(lat, lon, zoom, $attachPoint) {
  L.mapbox.accessToken = publicKey;


  var map = L.mapbox.map($attachPoint, 'mapbox.streets', {
    zoomControl: false
  }).setView([lat, lon], zoom);

  var styleLayer = L.mapbox.styleLayer("mapbox://styles/daniel0524/cis724skz004ygrm842fl6sss")
    .addTo(map);
}

module.exports = {
  render: function(lat, lon, $attachPoint) {
    renderMap(lat, lon, 15, $attachPoint);
  }
}
