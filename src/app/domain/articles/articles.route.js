(function () {
  'use strict';

  angular
    .module('vseramki')
    .config(routerConfig)
  ;

  function routerConfig($stateProvider) {
    $stateProvider
      .state('articles', {
        url: '/articles',
        templateUrl: 'app/domain/articles/articles.html',
        controller: 'ArticlesController',
        controllerAs: 'vm'
      })
    ;
  }

}());
