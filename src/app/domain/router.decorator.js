'use strict';

(function () {

  function RouterDecorator($rootScope, $state, localStorageService) {

    $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {

      if (toState.defaultChild) {
        let mode = localStorageService.get(toState.name+'.mode') || toState.defaultChild;
        if (toParams.item) {
          mode += '.item';
          toParams = {
            id: toParams.item
          }
        }
        event.preventDefault();
        return $state.go(toState.name + '.' + mode, toParams, {inherit: false});
      }

    });

    $rootScope.$on('$stateChangeSuccess', (event, toState) => {

      var parentDefaultChild = _.get(toState,'parent.defaultChild');

      if (parentDefaultChild) {

        let mode = toState.name.match(/[^\.]*$/);

        if (mode) {
          localStorageService.set(toState.parent.name + '.mode', mode[0]);
        }
      }

    });
  }

  angular.module('vseramki')
    .run(RouterDecorator);

})();
