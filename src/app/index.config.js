'use strict';

(function () {

  angular
    .module('vseramki')
    .config(config)
    .service('DEBUG', DEBUG)
  ;

  function config($logProvider, $mdThemingProvider, localStorageServiceProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // define themes for material
    $mdThemingProvider.theme('success-toast');
    $mdThemingProvider.theme('fail-toast');
    $mdThemingProvider.theme('warn-toast');

    localStorageServiceProvider
      .setPrefix('ls');
  }

  function DEBUG(saDebug) {
    return saDebug.log('stm:vr');
  }

})();
