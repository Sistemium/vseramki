'use strict';

(function () {

  angular
    .module('vseramki')
    .config(routerConfig)
  ;

  function routerConfig(stateHelperProvider) {
    stateHelperProvider
      .state({
        name: 'login',
        url: '/login?error',
        templateUrl: 'app/domain/auth/login.html',
        controller: 'LoginController as vm'
      })
    ;
  }

}());
