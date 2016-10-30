'use strict';

(function () {

  angular
    .module('vseramki')
    .config(routerConfig)
  ;

  /** @ngInject */
  function routerConfig(stateHelperProvider) {
    stateHelperProvider
      .state({
        name: 'import',
        url: '/import/:model',
        templateUrl: 'app/domain/import/import.html',
        controller: 'ImportController',
        controllerAs: 'vm',
        data: {
          needRoles: 'admin'
        }
      });
  }

}());
