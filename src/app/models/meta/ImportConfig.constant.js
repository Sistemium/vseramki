'use strict';

(function () {

  var columns = [
    {
      name: 'codeExternal',
      label: 'Код'
    }, {
      name: 'nameExternal',
      label: 'Наименование'
    }, {
      name: 'code',
      label: 'Артикул',
      replace: false
    }, {
      name: 'borderWidth',
      label: 'Ширина багета',
      parser: parseInt,
      defaultValue: 0
    }, {
      name: 'colour.name',
      model: 'Colour',
      label: 'Цвет',
      ref: 'colourId'
    }, {
      name: 'surface.name',
      model: 'Surface',
      label: 'Поверхность',
      ref: 'surfaceId'
    }, {
      name: 'material.name',
      model: 'Material',
      label: 'Материал',
      ref: 'materialId'
    }, {
      name: 'brand.name',
      model: 'Brand',
      label: 'Бренд',
      ref: 'brandId',
      replace: false,
      compute: item => {

        var name = item['Наименование'];
        if (!name) {
          return null;
        }

        var re = /"(.+)"/;
        var res = _.last(name.match(re));

        if (res) {
          return res;
        }

        re = / ([А-Я][а-я]+) /;
        res = _.last(name.match(re));

        return res;

      }
    }
  ];

  angular
    .module('vseramki')
    .constant('ImportConfig', {

      Baguette: {
        columns,
        doneSref: 'baguettes'
      }

    });

})();
