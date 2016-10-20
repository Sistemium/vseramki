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
            localField: 'positions',
            foreignKey: 'saleOrderId'
          }
        }
      },

      methods: {

        cost: function () {
          return Math.round(100.0 * this.count * this.price) / 100.0;
        },

        orderSubTotal: () => {
          return _.sumBy(this.positions, item =>
            item.count > 0 ? Math.round(100.0 * item.priceOrigin * item.count) / 100.0 : 0
          );
        },

        orderTotal: function () {
          var items = this.positions;
          var subTotal = model.orderSubTotal(items);

          return _.sumBy(items, item => item.count ? item.cost(subTotal) : 0);
        },

        recalcTotals: function (vm) {

          var model = this;
          var items = model.positions;

          vm.cartSubTotal = model.orderSubTotal();
          vm.cartTotal = model.orderTotal();
          vm.cartItems = items.length;
          vm.cartHasDiscount = (vm.cartSubTotal > vm.cartTotal);
          vm.cartDiscount = (1 - vm.cartTotal / vm.cartSubTotal) * 100;
          vm.cartTotalCount = _.sumBy(items, 'count');
        }

      }

    });

  }

}());
