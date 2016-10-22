'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('SaleOrderController', SaleOrderController)
  ;

  function SaleOrderController($scope, Schema, AuthHelper, $state, TableHelper, ControllerHelper) {

    var vm = ControllerHelper.setup(this, $scope, onStateChange);

    var SaleOrder = Schema.model('SaleOrder');

    _.assign(vm, {
      userId: _.get(AuthHelper.getUser(), 'id'),
      pagination: TableHelper.pagination(),
      onPaginate: TableHelper.setPagination,
      rootState: 'saleOrders',
      sideNavListItemClick: goToOrder,
      saleOrderRowClick: goToOrder
    });

    /*
     Init
     */

    SaleOrder.bindAll({}, $scope, 'vm.saleOrders');

    loadData();

    /*
     Functions
     */

    function onStateChange(toState, toParams) {

      vm.currentItem = _.get(toParams, 'id') &&
        SaleOrder.find(toParams.id)
          .then(item => vm.currentItem = item);

    }

    function goToOrder(item) {
      $state.go('saleOrders.info', {id: item.id})
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
