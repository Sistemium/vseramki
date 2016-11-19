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
        name: 'profile',
        url: '/profile',
        templateUrl: 'app/domain/userInfo/userInfo.html',
        controller: 'UserInfoController',
        controllerAs: 'vm',
        data: {
          needRoles: true,
          title: 'Профиль'
        }
      });
  }

}());
