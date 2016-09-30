'use strict';

(function () {

  angular
    .module('vseramki')
    .config(routerConfig)
  ;

  function routerConfig(stateHelperProvider) {

    var children = [{
      name: 'edit',
      url: '/edit/:id',
      templateUrl: 'app/domain/baguette/baguetteEdit.html',
      controller: 'BaguetteEditController',
      controllerAs: 'vm'
    }, {
      name: 'create',
      url: '/create',
      templateUrl: 'app/domain/baguette/baguetteCreate.html',
      controller: 'BaguetteEditController',
      controllerAs: 'vm'
    }];

    stateHelperProvider

      .state({

        name: 'baguettes',
        url: '/baguettes',
        templateUrl: 'app/domain/baguette/baguettes.html',
        controller: 'BaguettesController',
        controllerAs: 'vm',
        defaultChild: 'table',

        data: {
          needRoles: 'admin'
        },

        children: [
          {
            name: 'tiles',
            url: '/tiles',
            templateUrl: 'app/domain/baguette/baguetteTiles.html',
            children: angular.copy(children)
          }, {
            name: 'table',
            url: '/table',
            templateUrl: 'app/domain/baguette/baguetteTable.html',
            children: angular.copy(children)
          }
        ]
      })

    ;
  }

}());
