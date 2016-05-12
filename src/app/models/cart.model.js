'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Cart', Cart)
  ;

  function Cart(Schema) {

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

      defaultAdapter: 'localStorage',

      addToCart: function (article) {

        var inCart = article.inCart;

        if (inCart) {
          inCart.count++;
        } else {
          inCart = model.inject ({
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
