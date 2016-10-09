'use strict';

(function () {

  function Helpers(ImageHelper, VSHelper, ToastHelper, AlertHelper, TableHelper) {

    return {
      ImageHelper, VSHelper, ToastHelper, AlertHelper, TableHelper
    };

  }

  angular.module('vseramki')
      .service('Helpers', Helpers);

})();
