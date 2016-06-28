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
      })
    ;
  }

}());
