'use strict';

(function () {

  angular
    .module('vseramki')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('privacy', {
        url: '/privacy',
        templateUrl: 'app/domain/privacy/privacy.html',
        data: {
          title: 'Конфиденциальность'
        },
      })
      .state('home', {
        url: '/?access-token',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('catalogue');
  }

})();
