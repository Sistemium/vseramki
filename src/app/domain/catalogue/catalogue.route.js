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
        name: 'create',
        url: '/create',
        templateUrl: 'app/domain/addFrame/editFrame.html',
        controller: 'AddFrameController',
        controllerAs: 'vm',
        data: {
          needRoles: 'admin'
        }
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
            controllerAs: 'vm',
            data: {
              needRoles: 'admin'
            }
          }

        ]
      }];


    stateHelperProvider
      .state({
        name: 'catalogue',
        url: '/catalogue?item',
        templateUrl: 'app/domain/catalogue/catalogue.html',
        controller: 'CatalogueController',
        controllerAs: 'vm',
        defaultChild: 'tiles',

        data: {
          title: 'Каталог'
        },

        children: [
          {
            name: 'tiles',
            url: '/tiles',
            templateUrl: 'app/domain/catalogue/catalogueTiles.html',
            children: angular.copy(children)
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
