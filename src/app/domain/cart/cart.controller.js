'use strict';

(function () {

  function CartController(Cart, Article, $scope, ArticleImage, $state, Baguette, Schema, AlertHelper) {

    var vm = this;
    var stateParam = [];
    var BaguetteImage = Schema.model('BaguetteImage');

    _.assign(vm, {

      clearCart,
      clearItem,
      saveItem,
      plusOne,
      minusOne,
      itemClick

    });

    /*

     Init

     */

    Baguette.findAll();
    BaguetteImage.findAll();
    ArticleImage.findAll();
    Article.findAll({limit: 1000})
      .then(refreshPrice);

    Cart.findAll().then(function (carts) {

      _.each(carts, function (cart) {

        stateParam.push({articleId: cart['articleId']});

        Article.find(cart.articleId)
          .catch(() => Cart.destroy(cart));
      });

    });

    /*

     Listeners

     */

    Cart.bindAll({}, $scope, 'vm.data', refreshPrice);

    /*

    Functions

     */

    function refreshPrice() {
      Cart.recalcTotals(vm);
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
        return Cart.destroy(item);
      }
      saveItem();
    }

  }

  angular
    .module('vseramki')
    .controller('CartController', CartController);


}());
