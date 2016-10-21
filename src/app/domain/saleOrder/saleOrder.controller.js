'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('SaleOrderController', SaleOrderController)
  ;

  function SaleOrderController($scope, Schema, AuthHelper, $state, TableHelper) {

    var vm = this;

    var SaleOrder = Schema.model('SaleOrder');

    _.assign(vm, {
      userId: _.get(AuthHelper.getUser(),'id'),
      pagination: TableHelper.pagination(),
      onPaginate: TableHelper.setPagination,
      rootState: 'saleOrders',
      goToOrder
    });

    /*
     Init
     */

    SaleOrder.bindAll({}, $scope, 'vm.saleOrders');

    loadData();

    /*
     Functions
     */


    function goToOrder(id) {
      console.log(id);
      $state.go('.info', {id: id});
    }

    function loadData() {
      if (vm.userId) {
        SaleOrder.findAll({
          creatorId: vm.userId
        });
      } else {
        //TODO: load by deviceUUID
      }
    }

  }

}());
