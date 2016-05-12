(function () {
  'use strict';

  angular
    .module('vseramki')
    .config(routerConfig)
  ;

  /** @ngInject */
  function routerConfig(stateHelperProvider) {
    stateHelperProvider
      .state({
        name: 'catalogue',
        url: '/catalogue',
        templateUrl: 'app/domain/catalogue/catalogue.html',
        controller: 'CatalogueController',
        controllerAs: 'vm'
      });
  }

}());
