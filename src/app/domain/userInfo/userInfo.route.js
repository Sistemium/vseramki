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
        name: 'userInfo',
        url: '/userInfo',
        templateUrl: 'app/domain/userInfo/userInfo.html',
        controller: 'UserInfoController',
        controllerAs: 'vm'
      })
    ;
  }

}());
