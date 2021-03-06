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

        name: 'saleOrders',
        url: '/saleOrders',
        templateUrl: 'app/domain/saleOrder/saleOrderTable.html',
        controller: 'SaleOrderController',
        controllerAs: 'vm',

        data: {
          needRoles: true,
          title: 'Заказы'
        },

        children: [{
          name: 'info',
          url: '/:id',
          templateUrl: 'app/domain/saleOrder/saleOrder.html',
          controller: 'CartController',
          controllerAs: 'vm',

          data: {
            needRoles: false
          },

          children: [{
            name: 'edit',
            url: '/edit',
            templateUrl: 'app/domain/saleOrder/saleOrder.html',
            controller: 'CartController',
            controllerAs: 'vm',

            data: {
              needRoles: false
            }

          }]

        }]
      });
  }

}());
