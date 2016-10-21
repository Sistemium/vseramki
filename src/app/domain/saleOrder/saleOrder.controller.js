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
      sideNavListItemClick,
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

    function onStateChange(toState, toParams) {

      vm.isRootState = !toParams.id;
      vm.currentItem = toParams;


      //if (vm.isRootState || !unbindBaguettes) {
      //  rebind(baguetteFilter);
      //}
      //
      //if (/\.edit$/.test(toState.name)) {
      //  Baguette.find(toParams.id)
      //    .then(function (item) {
      //      vm.currentItem = item;
      //    });
      //  scrollToIndex();
      //} else {
      //  vm.currentItem = false;
      //}

    }

    function sideNavListItemClick(item) {
      $state.go('saleOrders.info', {id: item.id})
    }

    function goToOrder(id) {
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
