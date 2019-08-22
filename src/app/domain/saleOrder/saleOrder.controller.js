'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('SaleOrderController', SaleOrderController);

  function SaleOrderController($scope, Schema, AuthHelper, $state, $timeout,
                               TableHelper, ControllerHelper, ToastHelper, SaleOrderExporting) {

    const vm = ControllerHelper.setup(this, $scope, onStateChange);

    const SaleOrder = Schema.model('SaleOrder');

    let lockOrdersScroll;

    _.assign(vm, {
      showEditButtons: false,
      userId: _.get(AuthHelper.getUser(), 'id'),
      isAdmin: AuthHelper.isAdmin(),
      pagination: TableHelper.pagination(),
      onPaginate: TableHelper.setPagination,
      rootState: 'saleOrders',
      articlesListTopIndex: false,
      blockMdSelect: false,
      sideNavListItemClick,
      goToOrder: onClickWithPrevent(goToOrder),
      editClick: goToEdit,
      printClick,
      goToEdit,
      arrowBackClick,
      fileDownloadClick(){
        vm.currentItem && SaleOrderExporting.exportExcel(vm.currentItem);
      }
    });

    /*
     Init
     */

    SaleOrder.bindAll({}, $scope, 'vm.saleOrders');


    vm.setBusy(loadData());

    /*
     Watch
     */

    $scope.$on('saleOrderFormState', (ev, data) => {
      vm.saleOrderForm = data;
    });

    /*
     Functions
     */

    function onStateChange(toState, toParams) {

      vm.currentItem = _.get(toParams, 'id') &&
        SaleOrder.find(toParams.id)
          .then(item => {
            vm.currentItem = item;
            scrollToIndex(vm.currentItem.id);
            lockOrdersScroll = false;
          });

    }

    function goToOrder(item) {
      $state.go('saleOrders.info', {id: item.id});
    }

    function loadData() {
      if (vm.isAdmin) {
        return SaleOrder.findAll({});
      }
      if (vm.userId) {
        SaleOrder.findAll({
          creatorId: vm.userId
        });
      } else {
        //TODO: load by deviceUUID
      }
    }

    function printClick() {
      window.print();
    }

    function onClickWithPrevent(fn) {
      return function (item, event) {
        if (_.get(event, 'defaultPrevented')) {
          return;
        }
        fn(item);
      }
    }

    function arrowBackClick() {
      $state.go('^')
    }

    function scrollToIndex() {

      const id = vm.id;

      // TODO substitute timeout

      if (id && !lockOrdersScroll) {
        $timeout(function () {
          vm.articlesListTopIndex = _.findIndex(vm.saleOrders, {'id': id});
        }, 200);
      }
    }

    function sideNavListItemClick(event, item) {

      $state.go('saleOrders.info', {id: item.id})
        .then(() => {
          event ? lockOrdersScroll = true : lockOrdersScroll = false;
        });
    }

    function goToEdit() {
      if ($state.params.id) {
        lockOrdersScroll = false;
        $state.go('saleOrders.info.edit');
      }
    }
  }

}());
