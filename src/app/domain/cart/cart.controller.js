'use strict';

(function () {

  function CartController($scope, $state, Schema, Helpers, $q, ToastHelper) {

    var vm = this;
    var {AlertHelper} = Helpers;

    var {
      Article,
      ArticleImage,
      Baguette,
      BaguetteImage,
      Cart,
      SaleOrder,
      SaleOrderPosition,
      User
      } = Schema.models();


    _.assign(vm, {

      id: $state.params.id,
      saleOrder: null,
      emailPattern: User.meta.emailPattern,

      clearCart,
      clearItem,
      saveItem,
      plusOne,
      minusOne,
      itemClick,
      onSubmit: saveSaleOrder,
      hasChanges,
      cancelChanges,
      save

    });

    var PositionsModel = vm.id ? SaleOrderPosition : Cart;
    var authUser = Helpers.AuthHelper.getUser();

    /*

     Init

     */

    if (vm.id) {
      vm.title = 'Заказ';
    } else {
      vm.title = 'Оформление заказа';
    }


    if (authUser) {
      User.find(authUser.id)
        .then(setup);
    } else {
      setup({});
    }

    Baguette.findAll();
    BaguetteImage.findAll();
    ArticleImage.findAll();
    Article.findAll()
      .then(refreshPrice);

    if (!vm.id) {
      Cart.findAll().then(function (carts) {

        _.each(carts, cart =>
          Article.find(cart.articleId)
            .catch(() => Cart.destroy(cart))
        );

      });
    }

    /*

     Listeners

     */

    $scope.$on('$destroy', $scope.$on('$stateChangeSuccess', (event, toState) => {

      vm.editMode = !(_.last((toState.name.split('.'))) != 'edit');

    }));


    PositionsModel.bindAll({
      saleOrderId: vm.id
    }, $scope, 'vm.data', refreshPrice);

    /*

     Functions

     */

    function setup(user) {

      if (vm.id) {
        SaleOrder.find(vm.id)
          .then(saleOrder => {
            vm.saleOrder = saleOrder;
            return SaleOrder.loadRelations(saleOrder);
          });
      } else {
        vm.saleOrder = SaleOrder.createInstance({
          creatorId: user.id,
          phone: user.phone,
          email: user.email,
          contactName: user.name,
          shipTo: user.address
        });
      }

    }

    function refreshPrice() {
      if (vm.id) {
        vm.saleOrder && vm.saleOrder.recalcTotals(vm);
      } else {
        Cart.recalcTotals(vm);
      }
    }

    function clearCart($event) {
      AlertHelper.showConfirm($event, 'Отменить заказ?')
        .then(() => {
          if (!vm.id) {
            Cart.destroyAll()
          } else {
            // TODO: set saleOrder status = 'canceled'
            console.error('Not implemented');
          }
        });
    }

    function itemClick(item) {
      $state.go('catalogue.table.item', {id: item.articleId});
    }

    function clearItem(item) {
      item.count = 0;
      PositionsModel.destroy(item);
    }

    function saveItem(item) {
      PositionsModel.save(item);
    }

    function plusOne(item) {
      item.count++;
      PositionsModel.save(item);
    }

    function minusOne(item) {

      item.count--;

      if (item.count < 1) {
        return PositionsModel.destroy(item);
      }
      saveItem();
    }

    function saveSaleOrder() {
      vm.saleOrder.processing = 'submitted';
      vm.busy = SaleOrder.create(vm.saleOrder)
        .then(saleOrder => {

          if (vm.id) {
            return;
          }

          var positions = _.map(vm.data, cartItem => {
            return SaleOrderPosition.create({
              saleOrderId: saleOrder.id,
              articleId: cartItem.articleId,
              count: cartItem.count,
              price: cartItem.article.discountedPrice(vm.cartSubTotal),
              priceOrigin: cartItem.article.highPrice
            });
          });

          return $q.all(positions)
            .catch(err=> {
              console.error(err);
              //TODO: delete created saleOrder if failed to create all positions
              return $q.reject();
            });

        })
        .then(()=> {

          Cart.destroyAll()
            .then(() => {
              $state.go('saleOrders.info', {id: vm.saleOrder.id})
                .then(()=> {
                  ToastHelper.success('Заказ успешно оформлен');
                });
            });


        });

    }

    function hasChanges() {
      return _.get(vm, 'saleOrder.id') && SaleOrder.hasChanges(vm.saleOrder.id);
    }

    function cancelChanges() {
      SaleOrder.revert(vm.saleOrder.id);
    }

    function save() {
      SaleOrder.save(vm.saleOrder);
    }


  }

  angular
    .module('vseramki')
    .controller('CartController', CartController)
    .filter('translate', function () {
      var dictionary = {submitted: 'Оформлен', accepted: 'Принят', delivery: 'Доставка', done: 'Выполнен'};

      return function (word) {
        return _.get(dictionary, word) || word;
      };
    });


}());
