'use strict';

(function () {

  function MapsHelper($window, mapApiLoad) {

    const me = {
      yandex: $window.ymaps
    };

    mapApiLoad(function () {
      me.yandex = $window.ymaps;
    });

    function yDistanceFn(a, b) {
      return me.yandex.coordSystem.geo.distance(a, b);
    }

    function yPixelDistance(a, b) {
      return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    }

    function yLatLng(location) {
      return [location.longitude, location.latitude];
    }

    function yMarkerConfig(options) {
      return {
        id: options.id,
        geometry: {
          type: 'Point',
          coordinates: yLatLng(options.location)
        },
        properties: {
          iconContent: options.content,
          hintContent: options.hintContent
        }
      };
    }

    function getBoundsOfArray(locations) {

      var
        minLatitude = _.min(locations, 'latitude'),
        maxLatitude = _.max(locations, 'latitude'),
        minLongitude = _.min(locations, 'longitude'),
        maxLongitude = _.max(locations, 'longitude')
        ;

      const res = {
        southwest: {
          latitude: minLatitude.latitude,
          longitude: minLongitude.longitude
        },
        northeast: {
          latitude: maxLatitude.latitude,
          longitude: maxLongitude.longitude
        }
      };

      res.center = {
        latitude: (res.southwest.latitude + res.northeast.latitude) / 2.0,
        longitude: (res.southwest.longitude + res.northeast.longitude) / 2.0
      };

      return res;

    }

    function yPixelCoords(map) {
      const zoom = map.getZoom();
      const projection = map.options.get('projection');
      return function (location) {
        return map.converter.globalToPage(
          projection.toGlobalPixels(yLatLng(location), zoom)
        );
      };
    }

    return angular.extend(me, {

      yLatLng,
      yMarkerConfig,
      yPixelDistance,
      yDistanceFn,
      getBoundsOfArray,
      yPixelCoords,

      checkinIcon: function (options) {
        return angular.extend({
          path: 'M22-48h-44v43h16l6 5 6-5h16z',
          fillColor: '#FFFFFF',
          fillOpacity: 1,
          strokeColor: '#0000',
          strokeWeight: 1,
          scale: 0.6
        }, options);
      }

    });

  }

  angular.module('vseramki')
    .service('MapsHelper', MapsHelper);

})();
