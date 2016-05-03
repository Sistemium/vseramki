'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Cart',Cart)
  ;

  function Cart(Schema) {

    return Schema.register({

      name: 'Cart',
      relations: {
        hasOne: {
          Article: {
            localField: 'article',
            localKey: 'articleId'
          }
        }
      },

      defaultAdapter: 'localStorage'

    });

  }

}());
