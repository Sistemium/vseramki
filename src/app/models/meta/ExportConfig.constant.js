'use strict';

(function () {

  angular
    .module('vseramki')
    .constant('ExportConfig', {

      Article: [
        {
          title: 'Код',
          property: 'code'
        }, {
          title: 'Наименование',
          property: 'name'
        }, {
          title: 'Размер',
          property: 'frameSize.name'
        }, {
          title: 'Мин. коробка',
          property: 'packageRel',
          type: 'number'
        }, {
          title: 'Вес ед., кг',
          property: 'pieceWeight',
          type: 'number'
        }, {
          title: 'Прозрачная вставка',
          property: 'screening.name'
        }, {
          title: 'Материал',
          property: 'material.name'
        }, {
          title: 'Крепление задника',
          property: 'backMount.name'
        }, {
          title: 'Бренд',
          property: 'brand.name'
        }, {
          title: 'Цвет',
          property: 'colour.name'
        }, {
          title: 'Мел_Опт_Цена',
          property: 'highPrice',
          type: 'number'
        }, {
          title: 'Спец_Цена',
          property: 'lowPrice',
          type: 'number'
        }
      ],

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
          title: 'Код',
          property: 'codeExternal'
        }
      ]

    });

})();
