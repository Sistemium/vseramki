'use strict';

(function () {

  angular
    .module('vseramki')
    .run(SaleOrder);

  function SaleOrder(Schema) {

    var processingDictionary = {
      submitted: 'Оформлен',
      accepted: 'Принят',
      delivery: 'Доставка',
      done: 'Выполнен'
    };

    function processingLabel (processing) {
      return processingDictionary[processing];
    }

    var model = Schema.register({

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

      labels: {
        count: {
          1: 'заказ',
          234: 'заказа',
          567890: 'заказов'
        }
      },

      meta: {
        dictionary: {
          processing: processingDictionary
        }
      },

      computed: {
        processingLabel: ['processing', processingLabel]
      },

      methods: {

        orderSubTotal: function () {
          return _.sumBy(this.positions, item =>
            item.count > 0 ? Math.round(100.0 * item.priceOrigin * item.count) / 100.0 : 0
          );
        },

        orderTotal: function () {
          var items = this.positions;
          var subTotal = this.orderSubTotal(items);

          return _.sumBy(items, item => item.count ? item.cost(subTotal) : 0);
        },

        recalcTotals: function (vm) {

          var model = this;
          var items = model.positions;

          // FIXME copy-pasted
          vm.cartSubTotal = model.orderSubTotal();
          vm.cartTotal = model.orderTotal();
          vm.cartItems = items.length;
          vm.cartHasDiscount = (vm.cartSubTotal > vm.cartTotal);
          vm.cartDiscount = (1 - vm.cartTotal / vm.cartSubTotal) * 100;
          vm.cartTotalCount = _.sumBy(items, 'count');
        }

      }

    });

    return model;

  }

}());
