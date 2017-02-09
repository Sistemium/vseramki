'use strict';

(function () {

  const location = {
    longitude: 37.3973159,
    latitude: 55.729908
  };

  function СontactsController(MapsHelper) {

    var vm = this;

    _.assign(vm, {

      map: {
        zoom: 12,
        center: MapsHelper.yLatLng(location),
        marker: MapsHelper.yMarkerConfig({
          id: 1,
          location: location,
          content: 'ООО «Ювит»'
        })
      },

      afterMapInit

    });

    function afterMapInit() {
      vm.map.ready = true;
    }

  }

  angular
    .module('vseramki')
    .controller('СontactsController', СontactsController);

}());
