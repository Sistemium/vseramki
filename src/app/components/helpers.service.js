'use strict';

(function () {

  function Helpers(ImageHelper, VSHelper, ToastHelper, AlertHelper, TableHelper, ControllerHelper) {

    return {
      ImageHelper, VSHelper, ToastHelper, AlertHelper, TableHelper, ControllerHelper
    };

  }

  angular.module('vseramki')
    .service('Helpers', Helpers);

})();
