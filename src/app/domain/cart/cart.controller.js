(function () {
  'use strict';

  angular
    .module('vseramki')
    .controller('CartController', CartController)
  ;

  function CartController(Cart,Article,$scope) {

    var vm = this;

    Cart.bindAll({},$scope,'vm.data');
    Cart.findAll().then(function(carts){
      _.each(carts,function (cart){
        Article.find(cart.articleId);
        //Cart.loadRelations(cart,['Article'],{adapter: 'http'})
        //  .then(function(c){
        //    console.log (c);
        //  })
        //  .catch(function(c){
        //    console.error (c);
        //  });
      });
    });

    function clearCart() {
      Cart.destroyAll();
    }

    function clearItem(item) {
      Cart.destroy(item);
    }

    angular.extend(vm, {
      clearCart: clearCart,
      clearItem: clearItem
    });


  }

}());
