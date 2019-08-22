(function () {

  function SaleOrderExporting(ExportExcel) {
    return {

      exportExcel(saleOrder) {

        const {ndoc, positions} = saleOrder;
        const name = `Заказ № ${ndoc}`;

        const headers = [
          {label: 'Заказ №', value: ndoc},
          {label: 'Контакт', value: saleOrder.contactName},
          {label: 'Адрес', value: saleOrder.shipTo},
          {label: 'E-mail', value: saleOrder.email},
          {label: 'Телефон', value: saleOrder.phone},
          {label: 'Комментарий', value: saleOrder.comment},
        ];

        const data = _.map(positions, pos => {
          const res = {cost: _.round(pos.count * pos.price, 2)};
          _.each(POSITIONS_CONFIG, ({property}) => _.set(res, property, _.get(pos, property)));
          return res;
        });

        ExportExcel.exportArrayWithConfig(data, POSITIONS_CONFIG, name, headers);

      },

    };
  }

  const POSITIONS_CONFIG = [
    {
      title: 'Артикул',
      property: 'article.code'
    }, {
      title: 'Наименование',
      property: 'article.name'
    }, {
      title: 'Количество',
      property: 'count',
      type: 'number',
      totalSum: true,
    }, {
      title: 'Цена',
      property: 'price',
      type: 'number'
    }, {
      title: 'Стоимость',
      property: 'price',
      type: 'number',
      totalSum: true,
    }
  ];


  angular.module('vseramki')
    .service('SaleOrderExporting', SaleOrderExporting);

})();
