(function() {
  'use strict';

  angular
    .module('vseramki')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
