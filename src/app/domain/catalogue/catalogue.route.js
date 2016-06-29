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
        name: 'catalogue',
        url: '/catalogue',
        templateUrl: 'app/domain/catalogue/catalogue.html',
        controller: 'CatalogueController',
        controllerAs: 'vm',

        children: [
          {
            name: 'item',
            url: '/:id',
            controller: 'ItemController',
            templateUrl: 'app/domain/itemView/item.html',
            controllerAs: 'vm',
            children:[
              {
                name: 'image',
                url: '/image/:imageId',
                controller: 'ItemImageController',
                templateUrl: 'app/domain/itemView/itemImage.html',
                controllerAs: 'vm'
              }
            ]
          }
        ]
      });
  }

}());
