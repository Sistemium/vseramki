'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('ItemController', ItemController)
  ;

  function ItemController($stateParams, Article, Cart, Schema) {

    var Colour = Schema.model('Colour');
    var Material = Schema.model('Material');
    var FrameSize = Schema.model('FrameSize');


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
      if (!article.inCart.count) {
        Cart.destroy(article.inCart);
      }
    }

    function onCartChange(article) {
      Cart.save(article.inCart);
      console.log(vm.colour);
    }


    Article.find($stateParams.id).then(function (article) {
      vm.article = article;

      if (vm.article) {

        Colour.find(vm.article.colourId).then(function (colour) {
          vm.colour = colour;
        });

        Material.find(vm.article.materialId).then(function (material) {
          vm.material = material;
        });

        FrameSize.find(vm.article.frameSizeId).then(function (size) {
          vm.size = size;
        });

      }

    });


    angular.extend(vm, {
      minusOne: minusOne,
      plusOne: plusOne,
      onBlur: onBlur,
      onCartChange: onCartChange,
      addToCart: Cart.addToCart,
      price: 33,
      article: ''
    });

  }

}());
