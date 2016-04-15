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
        name: 'articles',
        url: '/articles',
        templateUrl: 'app/domain/articles/articles.html',
        controller: 'ArticlesController',
        controllerAs: 'vm'
      })
    ;
  }

}());
