'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('CartController', CartController)
  ;

  function CartController(Cart, Article, $scope, ArticleImage, $state, Baguette, Schema, AlertHelper) {

    var vm = this;
    var stateParam = [];
    var BaguetteImage = Schema.model('BaguetteImage');

    Cart.bindAll({}, $scope, 'vm.data', refreshPrice);

    Baguette.findAll();
    BaguetteImage.findAll();
    ArticleImage.findAll();

    Cart.findAll().then(function (carts) {

      _.each(carts, function (cart) {

        stateParam.push({articleId: cart['articleId']});

        Article.find(cart.articleId)
          .catch(() => Cart.destroy(cart));
      });

    });

    function refreshPrice() {
      vm.cartSubTotal = Cart.orderSubTotal();
      vm.cartTotal = Cart.orderTotal();
    }

    function clearCart($event) {
      AlertHelper.showConfirm($event, 'Отменить заказ?')
        .then(response => response && Cart.destroyAll());
    }

    function itemClick(item) {
      $state.go('catalogue.table.item', {id: item.articleId});
    }

    function clearItem(item) {
      item.count = 0;
      Cart.destroy(item);
    }

    function saveItem(item) {
      Cart.save(item);
    }

    function plusOne(item) {
      item.count++;
      Cart.save(item);
    }

    function minusOne(item) {

      item.count--;

      if (item.count < 1) {
        item.count = 1;
      }
      saveItem();
    }

    angular.extend(vm, {
      clearCart,
      clearItem,
      saveItem,
      plusOne,
      minusOne,
      itemClick
    });

  }

}());
