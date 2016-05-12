(function () {
  'use strict';

  angular
    .module('vseramki')
    .config(routerConfig)
  ;


  function routerConfig(stateHelperProvider) {
    stateHelperProvider
      .state({
        name: 'item',
        url: '/item/:id',
        controller: 'ItemController',
        templateUrl: 'app/domain/itemView/item.html',
        controllerAs: 'vm'
      })
    ;
  }

}());
