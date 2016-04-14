(function () {
  'use strict';

  angular
    .module('vseramki')
    .config(routerConfig)
  ;

  function routerConfig(stateHelperProvider) {
    stateHelperProvider
      .state({
        name: 'articles',
        url: '/articles',
        templateUrl: 'app/domain/articles/articles.html',
        controller: 'ArticlesController',
        controllerAs: 'vm'
      })
    ;
  }

}());
