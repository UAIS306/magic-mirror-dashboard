'use strict';

var Mustache = require('mustache');
var $ = require('jquery');
var _ = require('lodash');
var mapbox = require('../third_party/mapbox');

var MAP_CENTER_LAT = 47.675696;
var MAP_CENTER_LON = -122.376601;
var ARRIVING_NOW_MESSAGING = 'Now';

//30 Seconds
var REFRESH_INTERVAL_30_SECONDS_IN_MS = 30 * 1000;

var $listContainer = $('.Transit--list-view')[0];
var $mapContainer = $('.Transit--map-view')[0];

var template =  '{{#stops}}' +
                '<div class="Transit--stop">' +
                  '<div class="Transit--stop-name">{{stopName}}</div>' +
                  '<div class="Transit--departure-list">' +
                    '{{#departures}}' +
                    '<div class="Transit--departure">' +
                        '<div class="Transit--departure-line-name">{{lineName}}</div>' +
                        '<div class="Transit--departure-time-to-depart">{{timeUntilDeparture}}</div>' +
                        '<div class="Transit--departure-time">{{departureTime}}</div>' +
                    '</div>' +
                    '{{/departures}}' +
                  '</div>' +
                '<div>' +
                '{{/stops}}';

var addZeros = function(i) {
  if (i < 10) {
    i = "0" + i
  };
  return i;
}

var formatDateAsTime = function(departureDate) {
  var hour = departureDate.getHours();
  var minute = addZeros(departureDate.getMinutes());
  return hour + ':' + minute;
}

var calculateTimeToDepart = function(departureDate) {
  var now = new Date();
  var diff = Math.abs(now - departureDate);
  var minutesToDeparture = Math.floor((diff/1000)/60);
  if (minutesToDeparture === 0) {
    return ARRIVING_NOW_MESSAGING;
  }
  return minutesToDeparture + " Min.";
}

var translateRoutes = function(routeList) {
  var translatedRouteList = [];
  _(routeList).forEach(function(route) {
    var departureDate = new Date(route.departureDate);
    var translatedRoute = {
      lineName: route.routeDisplayName,
      timeUntilDeparture: calculateTimeToDepart(departureDate),
      departureTime: formatDateAsTime(departureDate)
    };
    translatedRouteList.push(translatedRoute);
  });
  return translatedRouteList;
}

var translateStops = function(stopList) {
  var translatedStopList = [];
  _(stopList).forEach(function(stop) {
    var translatedStop = {
      stopName: stop.displayName,
      departures: translateRoutes(stop.departures)
    };
    translatedStopList.push(translatedStop);
  });
  return translatedStopList;
}

var startTransitRenderRefresh = function() {
  var handleGetTransitSuccess = function(data) {
    var view = {
      stops: translateStops(data.data)
    };
    var output = Mustache.render(template, view);
    $listContainer.innerHTML = output;
    mapbox.render(MAP_CENTER_LAT, MAP_CENTER_LON, $mapContainer)
  }

  var renderTransitData = function() {
    var url = '/transit';

    $.ajax({
      url: url,
      success: handleGetTransitSuccess,
      dataType: 'json'
    });

    setTimeout(renderTransitData, REFRESH_INTERVAL_30_SECONDS_IN_MS);
  }

  renderTransitData();
}

$(document).ready(function() {
  startTransitRenderRefresh();
});
