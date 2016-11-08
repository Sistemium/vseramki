'use strict';

(function () {

  angular
    .module('vseramki')
    .constant('ExportConfig', {

      Baguette: [
        {
          title: 'Наименование',
          property: 'name'
        }, {
          title: 'Артикул',
          property: 'code'
        }, {
          title: 'Бренд',
          property: 'brand.name'
        }, {
          title: 'Материал',
          property: 'material.name'
        }, {
          title: 'Цвет',
          property: 'colour.name'
        }, {
          title: 'Ширина багета',
          property: 'borderWidth',
          type: 'number'
        }, {
          title: 'Поверхность',
          property: 'surface.name'
        }, {
          title: 'Код 1С',
          property: 'code'
        }
      ],

      Article: []

    });

})();
