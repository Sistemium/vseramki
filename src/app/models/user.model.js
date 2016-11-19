'use strict';

(function () {

  angular
    .module('vseramki')
    .run(User);

  function User(Schema) {

    const validSymbols = '\\dA-z\\-\\._$';

    return Schema.register({

      name: 'User',

      relations: {
        hasMany: {
          SaleOrder: {
            localField: 'saleOrders',
            foreignKey: 'creatorId'
          }
        }
      },

      meta: {
        emailPattern: new RegExp(`[${validSymbols}]+@[${validSymbols}]+\\.[A-z]{2,}$`)
      }

    });

  }

}());
