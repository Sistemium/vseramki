'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Cart', Cart)
  ;

  function Cart(Schema) {

    var totalThreshold = 100000;
    var minThreshold = 10000;

    var model = Schema.register({

      name: 'Cart',
      relations: {
        hasOne: {
          Article: {
            localField: 'article',
            localKey: 'articleId'
          }
        }
      },

      methods: {
        cost: function (total) {
          var useTotal = total < totalThreshold ? total : totalThreshold;

          if (useTotal <= minThreshold) {
            useTotal = 0;
          }

          return this.article && this.count > 0 ? Math.round(100.0 * this.count * this.article.discountedPrice(useTotal)) / 100.0 : 0;
        }
      },

      defaultAdapter: 'localStorage',

      recalcTotals: function (vm) {

        var items = model.getAll();

        vm.cartSubTotal = model.orderSubTotal();
        vm.cartTotal = model.orderTotal();
        vm.cartItems = items.length;
        vm.cartHasDiscount = (vm.cartSubTotal > vm.cartTotal);
        vm.cartDiscount = (1 - vm.cartTotal / vm.cartSubTotal) * 100;
        vm.cartTotalCount = _.sumBy(items,'count');
      },

      orderSubTotal: function (items) {
        items = items || model.getAll();
        return _.sumBy(items, item => item.article && item.count > 0 ? Math.round(100.0 * item.article.highPrice * item.count) / 100.0 : 0);
      },

      orderTotal: function (items) {
        items = items || model.getAll();
        var subTotal = model.orderSubTotal(items);

        return _.sumBy(items, item => item.count ? item.cost(subTotal) : 0);
      },

      addToCart: function (article) {

        var inCart = article.inCart;

        if (inCart) {
          inCart.count++;
        } else {
          inCart = model.inject({
            id: uuid.v4(),
            articleId: article.id,
            count: 1
          })
        }

        model.save(inCart);

      }

    });

    return model;

  }

}());
