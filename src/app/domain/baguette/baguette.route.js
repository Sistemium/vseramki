(function () {
  'use strict';

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
    },{
      name: 'create',
      url: '/create',
      templateUrl: 'app/domain/baguette/baguetteEdit.html',
      controller: 'BaguetteEditController',
      controllerAs: 'vm'
    }];

    stateHelperProvider

      .state({

        name: 'baguettes',
        url: '/baguettes',
        template: '<div class="ui-view"></div>',

        defaultChild: 'table',

        children: [
          {
            name: 'tiles',
            url: '/tiles',
            templateUrl: 'app/domain/baguette/baguetteTiles.html',
            controller: 'BaguettesController',
            controllerAs: 'vm',
            children: angular.copy(children)
          },{
            name: 'table',
            url: '/table',
            templateUrl: 'app/domain/baguette/baguetteTable.html',
            controller: 'BaguettesController',
            controllerAs: 'vm',
            children: angular.copy(children)
          }
        ]
      })

    ;
  }

}());
