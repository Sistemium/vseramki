'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('CartController', CartController)
  ;

  function CartController(Cart, Article, $scope, ArticleImage) {

    var vm = this;
    var stateParam = [];

    Cart.bindAll({}, $scope, 'vm.data', refreshPrice);

    ArticleImage.findAll();
    Cart.findAll().then(function (carts) {
      _.each(carts, function (cart) {
        stateParam.push({articleId: cart['articleId']});
        Article.find(cart.articleId);

      });
    });

    function refreshPrice() {
      vm.cartSubTotal = Cart.orderSubTotal();
      vm.cartTotal = Cart.orderTotal();
    }

    function clearCart() {
      Cart.destroyAll();
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
      minusOne
    });

  }

}());
