'use strict';

(function () {

  angular
    .module('vseramki')
    .config(routerConfig)
  ;

  /** @ngInject */
  function routerConfig(stateHelperProvider) {
    stateHelperProvider
      .state({
        name: 'catalogue',
        url: '/catalogue',
        templateUrl: 'app/domain/catalogue/catalogue.html',
        controller: 'CatalogueController',
        controllerAs: 'vm',

        children: [

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
                name: 'image',
                url: '/image/:imageId',
                controller: 'ItemImageController',
                templateUrl: 'app/domain/itemView/itemImage.html',
                controllerAs: 'vm'
              },
              {
                name: 'edit',
                url: '/edit',
                templateUrl: 'app/domain/addFrame/editFrame.html',
                controller: 'AddFrameController',
                controllerAs: 'vm'
              }
            ]
          }
        ]
      });
  }

}());
