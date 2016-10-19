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
      }

    });

  }

}());
