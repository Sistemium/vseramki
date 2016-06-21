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
        name: 'admin',
        url: '/admin/:articleId',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminController',
        controllerAs: 'vm'
      })
    ;
  }

}());
