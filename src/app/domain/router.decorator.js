'use strict';

(function () {

  function RouterDecorator($rootScope, $state, localStorageService, Entity, $window) {

    let entityLoading;

    const ensureEntityLoad = $rootScope.$on('$stateChangeStart', (event, to, params) => {

      event.preventDefault();

      if (entityLoading) {
        return;
      }

      entityLoading = Entity.findAll()
        .then(()=>{
          ensureEntityLoad();
          $state.go(to, params);
        });

    });

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

      const parentDefaultChild = _.get(toState,'parent.defaultChild');

      if (parentDefaultChild) {

        let mode = toState.name.match(/[^\.]*$/);

        if (mode) {
          localStorageService.set(toState.parent.name + '.mode', mode[0]);
        }
      }

      const title = _.get(toState, 'data.title');

      $window.document.title = title ? `Все рамки - ${title}` : 'Все рамки';

    });
  }

  angular.module('vseramki')
    .run(RouterDecorator);

})();
