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
        name: 'saleorder',
        url: '/saleorder/:id',
        templateUrl: 'app/domain/saleOrder/saleOrder.html',
        controller: 'CartController',
        controllerAs: 'vm'
      })
    ;
  }

}());
