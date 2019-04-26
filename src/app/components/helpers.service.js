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
      VSHelper,
      util
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
        VSHelper,
        util,

      };

    });

})();
