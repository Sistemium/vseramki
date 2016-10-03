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
        name: 'cart',
        url: '/cart',
        templateUrl: 'app/domain/cart/cart.html',
        controller: 'CartController',
        controllerAs: 'vm',
        children: [
          {
            name: 'checkout',
            url: '/checkout',
            templateUrl: 'app/domain/cart/checkout.html',
          }
        ]
      })
    ;
  }

}());
