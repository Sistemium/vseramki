'use strict';

(function () {

  function CartController($scope, $state, Schema, Helpers, $q, $mdDialog, localStorageService) {

    const {AlertHelper, ToastHelper, ControllerHelper, AuthHelper} = Helpers;

    var vm = ControllerHelper.setup(this, $scope, onStateChange)
      .use(AuthHelper);

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

    vm.use({

      id: $state.params.id,
      saleOrder: null,
      emailPattern: User.meta.emailPattern,

      processingDictionary: _.sortBy(_.map(SaleOrder.meta.dictionary.processing, (label, status) => {return {label, status}}), 'label'),

      checkout,
      clearCart,
      clearItem,
      saveItem,
      plusOne,
      minusOne,
      itemClick,
      onSubmit: saveSaleOrder,
      hasChanges,
      cancelChanges,
      save,
      changeOrderStatus,

      offerLoginReject,
      offerLoginAccept,

      checkClick: () => {

        var isFormDirty = _.get(vm, 'attrsForm.$dirty');

        if (isFormDirty) {
          SaleOrder.save(vm.saleOrder).then(() => {
            ToastHelper.success('Изменено');
            makeFormDirty();
            $state.go('^');
          });
        } else {
          $state.go('^');
        }

      },

      closeClick: () => {
        SaleOrder.revert(vm.saleOrder.id);
        makeFormDirty();
      },

      deleteClick: () => {

        AlertHelper.showConfirm('', 'Отменить заказ?')
          .then(() => {

            //TODO delete salerOrderPositions
            SaleOrder.destroy(vm.saleOrder.id);
            $state.go('saleOrders');
          });

      },

      hide: () => $mdDialog.hide()

    });

    var PositionsModel = vm.id ? SaleOrderPosition : Cart;
    var authUser = AuthHelper.getUser();

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

    PositionsModel.bindAll({
      saleOrderId: vm.id
    }, $scope, 'vm.data', refreshPrice);


    $scope.$watch(() => {
      return {
        invalid: _.get(vm, 'attrsForm.$invalid'),
        dirty: _.get(vm, 'attrsForm.$dirty')
      }
    }, (state) => {
      $scope.$emit('saleOrderFormState', state);
    }, true);

    /*

     Functions

     */

    function setup(user) {

      vm.userEmptyFieldKeys = _.keys(_.pickBy(user, _.isNull));

      if (vm.id) {
        SaleOrder.find(vm.id)
          .then(saleOrder => {
            vm.saleOrder = saleOrder;
            return SaleOrder.loadRelations(saleOrder);
          })
          .catch(() => {
            $state.go('^');
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

    function onStateChange() {

      vm.editMode = vm.currentState === 'edit';

    }

    function makeFormDirty() {
      _.result(vm, 'attrsForm.$setUntouched');
      _.result(vm, 'attrsForm.$setPristine');
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

      vm.busy = true;
      vm.saleOrder.processing = 'submitted';

      SaleOrder.create(vm.saleOrder)
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

          if (authUser) {
            User.find(authUser.id).then(function (user) {
              var userObject = user;
              vm.userEmptyFieldKeys.forEach(function (key) {
                var keyDup = key;
                if (keyDup === 'address') {
                  keyDup = 'shipTo';
                }
                userObject[key] = vm.saleOrder[keyDup];
              });
              User.save(userObject).catch(function (err) {
                console.error(err);
              });
            });
          }


          Cart.destroyAll()
            .then(() => {
              $state.go('saleOrders.info', {id: vm.saleOrder.id})
                .then(()=> {
                  ToastHelper.success('Заказ успешно оформлен');
                  vm.busy = false;
                });
            });
        })

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

    function checkout(event) {

      if (authUser) {
        $state.go('checkout');
      } else {
        offerLogin(event);
      }

    }

    function offerLogin(ev) {

      $mdDialog.show({
        controller: CartController,
        controllerAs: 'vm',
        templateUrl: 'app/domain/cart/checkout/checkoutDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: true
      })

    }

    function offerLoginReject() {
      answer('checkout');
    }

    function offerLoginAccept() {
      answer('login');
    }

    function answer(answer) {
      $state.go(answer);
      vm.hide();
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

  angular
    .module('vseramki')
    .controller('CartController', CartController);


}());
