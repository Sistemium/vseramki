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
        name: 'delivery',
        url: '/delivery',
        templateUrl: 'app/domain/delivery/delivery.html'
      });
  }

}());
