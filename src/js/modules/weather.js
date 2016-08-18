var $ = require('jquery');
var $container = $('#forecast-io');

var COLOR = '#FFFFFF';
var REFRESH_INTERVAL_10_MINUTES_IN_MS = 600000;

var forcastIO = require('../third_party/forecast-io');

var startWeatherRenderInterval = function() {
  var renderWeatherWidget = function() {
    $container.empty();
    forcastIO.render(COLOR, $container)
    setTimeout(renderWeatherWidget, REFRESH_INTERVAL_10_MINUTES_IN_MS);
  }

  renderWeatherWidget();
}

$(document).ready(function() {
  startWeatherRenderInterval();
});
