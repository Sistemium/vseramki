(function() {
  'use strict';

  angular
    .module('vseramki')
    .config(config)
    .service('DEBUG',DEBUG)
  ;

  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

  function DEBUG (saDebug) {
    return saDebug.log ('stm:vr');
  }

})();
