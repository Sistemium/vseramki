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
        name: 'info',
        url: '/info',
        templateUrl: 'app/domain/companyInfo/info.html',
        controller: 'InfoController',
        controllerAs: 'vm'
      });
  }

}());
