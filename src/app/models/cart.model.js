'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Cart', Cart)
  ;

  function Cart(Schema) {

    var totalThreshold = 100000;

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
        cost: function(total) {
          total = total < totalThreshold ? total : totalThreshold;
          total = total >= 0 ? total : 0;

          return  Math.round(100.0 * this.count * this.article.discountedPrice(total))/100.0;
        }
      },

      defaultAdapter: 'localStorage',

      orderSubTotal: function (items) {
        items = items || model.getAll();
        return _.sumBy(items, item => Math.round(100.0 * item.article.highPrice * item.count)/100.0);
      },

      orderTotal: function (items) {
        items = items || model.getAll();
        var subTotal = model.orderSubTotal(items);

        return _.sumBy(items, item => item.cost(subTotal));
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
