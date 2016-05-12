'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('ItemController', ItemController)
  ;

  function ItemController($stateParams, Article, Cart) {

    var vm = this;

    function minusOne(item) {

      var cart = item.inCart;

      cart.count--;

      if (!cart.count) {
        Cart.destroy(cart);
      } else {
        Cart.save(cart);
      }
    }

    function plusOne(item) {
      var cart = item.inCart;
      cart.count = (cart.count || 0) + 1;
      Cart.save(cart);
    }

    function onBlur(article) {
      console.log(article);
      if (!article.inCart.count) {
        Cart.destroy(article.inCart);
      }
    }

    function onCartChange(article) {
      console.log(article);
      Cart.save(article.inCart);
    }


    Article.find($stateParams.id).then(function (article) {
      vm.article = article;
    });

    angular.extend(vm, {
      minusOne: minusOne,
      plusOne: plusOne,
      onBlur: onBlur,
      onCartChange: onCartChange,
      addToCart: Cart.addToCart,
      price: 33
    });

  }

}());
