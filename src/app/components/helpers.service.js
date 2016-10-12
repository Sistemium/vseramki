'use strict';

(function () {

  function Helpers(ImageHelper, VSHelper, ToastHelper, AlertHelper, TableHelper, ControllerHelper, AuthHelper) {

    return {
      ImageHelper, VSHelper, ToastHelper, AlertHelper, TableHelper, ControllerHelper, AuthHelper
    };

  }

  angular.module('vseramki')
    .service('Helpers', Helpers);

})();
