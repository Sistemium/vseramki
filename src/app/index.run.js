(function() {
  'use strict';

  angular
    .module('vseramki')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $state) {

    var defaultChildHelperSubscription = $rootScope.$on('$stateChangeSuccess', function (event, toState) {

      if (toState.defaultChild) {
        $state.go('.' + toState.defaultChild);
      }

    });

    $rootScope.$on('$destroy', defaultChildHelperSubscription);

    $log.debug('runBlock end');

  }

})();
