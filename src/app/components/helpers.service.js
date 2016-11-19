'use strict';

(function () {

  angular.module('vseramki')
    .service('Helpers', function(
      AlertHelper,
      AuthHelper,
      ControllerHelper,
      ExportConfig,
      ImageHelper,
      ImportConfig,
      ImportExcel,
      ToastHelper,
      TableHelper,
      VSHelper
    ) {

      return {

        AlertHelper,
        AuthHelper,
        ControllerHelper,
        ExportConfig,
        ImageHelper,
        ImportConfig,
        ImportExcel,
        ToastHelper,
        TableHelper,
        VSHelper

      };

    });

})();
