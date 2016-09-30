'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('СontactsController', СontactsController);


  function СontactsController(MapsHelper) {

    var vm = this;

    const location = {
      longitude: 37.3973159,
      latitude: 55.729908
    };

    angular.extend(vm, {
      map: {
        zoom: 12,
        center: MapsHelper.yLatLng(location),
        marker: MapsHelper.yMarkerConfig({
          id: 1,
          location: location,
          content: 'ООО «Ювит»'
        })
      }
    });

  }

}());
