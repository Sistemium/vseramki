'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('SaleOrderController', SaleOrderController);

  function SaleOrderController($scope, Schema, AuthHelper, $state, TableHelper, ControllerHelper, ToastHelper, $timeout) {

    var vm = ControllerHelper.setup(this, $scope, onStateChange);

    var SaleOrder = Schema.model('SaleOrder');

    var lockOrdersScroll;

    _.assign(vm, {
      showEditButtons: false,
      userId: _.get(AuthHelper.getUser(), 'id'),
      isAdmin: AuthHelper.isAdmin(),
      pagination: TableHelper.pagination(),
      onPaginate: TableHelper.setPagination,
      rootState: 'saleOrders',
      articlesListTopIndex: false,
      dictionary: {
        submitted: ['submitted', 'Оформлен'],
        accepted: ['accepted', 'Принят'],
        delivery: ['delivery', 'Доставка'],
        done: ['done', 'Выполнен']
      },
      blockMdSelect: false,
      sideNavListItemClick,
      goToOrder: onClickWithPrevent(goToOrder),
      editClick: goToEdit,
      printClick,
      goToEdit,
      arrowBackClick,
      closeClick
      //checkClick

    });

    /*
     Init
     */

    SaleOrder.bindAll({}, $scope, 'vm.saleOrders');


    loadData();

    /*
     Watch
     */

    $scope.$on('saleOrderFormState', (ev, data) => {
      vm.saleOrderForm = data;
    });

    //$scope.$watch('vm.currentItem', function () {
    //
    //  if (vm.currentState === 'edit') {
    //    vm.showEditButtons = SaleOrder.hasChanges(vm.currentItem);
    //  } else {
    //    vm.showEditButtons = false;
    //  }
    //
    //}, true);


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

    function closeClick() {
      SaleOrder.revert(vm.currentItem.id);
    }

    //function checkClick() {
    //  SaleOrder.save(vm.currentItem).then(() => {
    //    ToastHelper.success('Изменено')
    //  });
    //}

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

      var id = vm.id;

      // TODO substitute timeout

      if (id && !lockOrdersScroll) {
        $timeout(function () {
          vm.articlesListTopIndex = _.findIndex(vm.saleOrders, {'id': id});
        }, 200);
      }
    }

    function sideNavListItemClick(event, item) {

      $state.go('saleOrders.info', {id: item.id})
        .then(()=> {
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
