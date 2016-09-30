'use strict';

(function () {

  angular
    .module('vseramki')
    .config(routerConfig)
  ;

  /** @ngInject */

  function routerConfig(stateHelperProvider) {

    var children = [

      {
        name: 'add',
        url: '/add',
        templateUrl: 'app/domain/addFrame/addFrame.html',
        controller: 'AddFrameController',
        controllerAs: 'vm'
      },

      {
        name: 'item',
        url: '/:id',
        controller: 'ItemController',
        templateUrl: 'app/domain/itemView/item.html',
        controllerAs: 'vm',
        children: [

          {
            name: 'edit',
            url: '/edit',
            templateUrl: 'app/domain/addFrame/editFrame.html',
            controller: 'AddFrameController',
            controllerAs: 'vm'
          }

        ]
      }];


    stateHelperProvider
      .state({
        name: 'catalogue',
        url: '/catalogue',
        templateUrl: 'app/domain/catalogue/catalogue.html',
        controller: 'CatalogueController',
        controllerAs: 'vm',
        defaultChild: 'tiles',

        children: [
          {
<<<<<<< HEAD
            name: 'tiles',
            url: '/tiles',
            templateUrl: 'app/domain/catalogue/catalogueTiles.html',
            children: angular.copy(children)
=======
            name: 'add',
            url: '/add',
            templateUrl: 'app/domain/addFrame/editFrame.html',
            controller: 'AddFrameController',
            controllerAs: 'vm'
>>>>>>> vr2
          },
          {
            name: 'table',
            url: '/table',
            templateUrl: 'app/domain/catalogue/catalogueTable.html',
            children: angular.copy(children)
          }
        ]
      });
  }

}());
