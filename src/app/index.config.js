'use strict';

(function () {

  angular
    .module('vseramki')
    .config(config)
    .service('DEBUG', DEBUG)
  ;

  function config($logProvider, $mdThemingProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // define themes for material
    $mdThemingProvider.theme('success-toast');
    $mdThemingProvider.theme('fail-toast');
  }

  function DEBUG(saDebug) {
    return saDebug.log('stm:vr');
  }

})();
