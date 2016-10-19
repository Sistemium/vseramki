'use strict';

(function () {

  angular
    .module('vseramki')
    .run(SaleOrder);

  function SaleOrder(Schema) {

    return Schema.register({
      name: 'SaleOrder',
      relations: {
        hasOne: {
          User: {
            localField: 'creator',
            localKey: 'creatorId'
          }
        },
        hasMany: {
          SaleOrderPosition: {
            localField: 'saleOrderPositions',
            foreignKey: 'saleOrderId'
          }
        }
      }
    });

  }

}());
