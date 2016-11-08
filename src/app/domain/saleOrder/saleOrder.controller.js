'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('SaleOrderController', SaleOrderController)
    .filter('translate', function () {
      var dictionary = {submitted: 'Оформлен', accepted: 'Принят', delivery: 'Доставка', done: 'Выполнен'};

      return function (word) {
        return _.get(dictionary, word) || word;
      };
    });

  function SaleOrderController($scope, Schema, AuthHelper, $state, TableHelper, ControllerHelper, ToastHelper, $timeout) {

    var vm = ControllerHelper.setup(this, $scope, onStateChange);

    var SaleOrder = Schema.model('SaleOrder');

    var lockOrdersScroll;

    _.assign(vm, {
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
      changeOrderStatus
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

    function onClickWithPrevent(fn) {
      return function (item, event) {
        if (_.get(event, 'defaultPrevented')) {
          return;
        }
        fn(item);
      }
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
