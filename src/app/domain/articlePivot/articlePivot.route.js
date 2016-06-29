(function () {
  'use strict';

  angular
    .module('vseramki')
    .config(routerConfig)
  ;

  function routerConfig(stateHelperProvider) {
    stateHelperProvider
      .state({
        name: 'articlePivot',
        url: '/articlePivot',
        templateUrl: 'app/domain/articlePivot/articlePivot.html',
        controller: 'ArticlePivotController',
        controllerAs: 'vm'
      })
    ;
  }

}());
