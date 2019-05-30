'use strict';

(function () {

  angular
    .module('vseramki')
    .config(routerConfig)
  ;

  function routerConfig(stateHelperProvider) {

    const children = [{
      name: 'edit',
      url: '/edit/:id',
      templateUrl: 'app/domain/baguette/editBaguette.html',
      controller: 'BaguetteEditController',
      controllerAs: 'vm'
    }, {
      name: 'create',
      url: '/create',
      templateUrl: 'app/domain/baguette/editBaguette.html',
      controller: 'BaguetteEditController',
      controllerAs: 'vm'
    }, {
      name: 'view',
      url: '/view/:id',
      template: '<baguette-view baguette-id="vm.params.id"></baguette-view>',
      controller: 'StateController as vm',
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
          title: 'Багеты',
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
