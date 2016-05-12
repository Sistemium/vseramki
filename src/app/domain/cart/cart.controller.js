'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('CartController', CartController)
  ;

  function CartController(Cart, Article, $scope) {

    var vm = this;

    Cart.bindAll({}, $scope, 'vm.data');
    Cart.findAll().then(function (carts) {
      _.each(carts, function (cart) {
        Article.find(cart.articleId);
      });
    });

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

      Cart.save(item);
    }

    function itemClick(item){
      console.log(item);
    }


    /* on remove article add animation */

    function itemRemove(item) {
      console.log (item, 'item');
    }

    angular.extend(vm, {
      clearCart: clearCart,
      clearItem: clearItem,
      saveItem: saveItem,
      plusOne: plusOne,
      minusOne: minusOne,
      itemClick: itemClick,
      itemRemove: itemRemove
    });


  }

}());
