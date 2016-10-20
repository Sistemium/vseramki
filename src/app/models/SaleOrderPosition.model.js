'use strict';

(function () {

  angular
    .module('vseramki')
    .run(SaleOrderPosition);

  function SaleOrderPosition(Schema) {

    return Schema.register({
      name: 'SaleOrderPosition',

      relations: {
        hasOne: {
          SaleOrder: {
            localField: 'saleOrder',
            localKey: 'saleOrderId'
          },
          Article: {
            localField: 'article',
            localKey: 'articleId'
          }
        }
      },

      methods: {

        cost: function () {
          return Math.round(100.0 * this.count * this.price) / 100.0;
        }

      }

    });

  }

}());
