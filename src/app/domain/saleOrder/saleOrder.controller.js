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

  function SaleOrderController($scope, Schema, AuthHelper, $state, TableHelper, ControllerHelper, ToastHelper) {

    var vm = ControllerHelper.setup(this, $scope, onStateChange);

    var SaleOrder = Schema.model('SaleOrder');

    _.assign(vm, {
      userId: _.get(AuthHelper.getUser(), 'id'),
      isAdmin: AuthHelper.isAdmin(),
      pagination: TableHelper.pagination(),
      onPaginate: TableHelper.setPagination,
      rootState: 'saleOrders',
      dictionary: {
        submitted: ['submitted', 'Оформлен'],
        accepted: ['accepted', 'Принят'],
        delivery: ['delivery', 'Доставка'],
        done: ['done', 'Выполнен']
      },
      blockMdSelect: false,
      sideNavListItemClick: goToOrder,
      goToOrder: onClickWithPrevent(goToOrder),
      printOrder,
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

    function printOrder() {
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


    function goToEdit() {
      if ($state.params.id) {
        $state.go('saleOrders.info.edit');
      }
    }

    function changeOrderStatus(id) {

      if (SaleOrder.hasChanges(id)) {
        vm.blockMdSelect = true;
        SaleOrder.save(id)
          .then(()=> ToastHelper.success('Статус изменен')
            .then(() => {
              vm.blockMdSelect = false;
            }))
          .catch(() => {
            ToastHelper.error('Статус не изменен').then(()=> {
              SaleOrder.revert(id);
              vm.blockMdSelect = false;
            });
          });
      }
    }
  }

}());
