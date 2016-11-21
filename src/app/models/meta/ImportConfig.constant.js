'use strict';

(function () {

  var BaguetteColumns = [
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

        return _.upperFirst(res);

      }
    }
  ];

  var ArticleColumns = [

    {
      name: 'codeExternal',
      label: 'Код'
    }, {
      name: 'name',
      label: 'Наименование'
    }, {
      name: 'nameExternal',
      label: 'Наименование (код 1С)',
      compute: item => {
        return item['Наименование']
      }
    }, {
      name: 'frameSize.name',
      model: 'FrameSize',
      label: 'Размер',
      ref: 'frameSizeId',
      compute: item => {

        var frameSize = item['Размер'];
        var formattedFrameSize;

        if (!frameSize) {
          return null;
        } else {
          var splitters = ['х', ' ', '*'];
          _.each(splitters, function (splitter) {
            var splittedVal = frameSize.split(splitter);
            if (splittedVal.length == 2) {
              formattedFrameSize = splittedVal[0] + 'x' + splittedVal[1];
              return false;
            }
          });
          return formattedFrameSize || frameSize;
        }

      }
    }, {
      name: 'packageRel',
      label: 'Мин. коробка',
      parser: parseInt
    }, {
      name: 'pieceWeight',
      label: 'Вес ед., кг',
      parser: parseFloat
    }, {
      name: 'screening.name',
      model: 'Screening',
      label: 'Прозрачная вставка',
      ref: 'screeningId'
    }, {
      name: 'material.name',
      model: 'Material',
      label: 'Материал',
      ref: 'materialId'
    }, {
      name: 'backMount.name',
      model: 'BackMount',
      label: 'Крепление задника',
      ref: 'backMountId'
    }, {
      name: 'brand.name',
      model: 'Brand',
      label: 'Бренд',
      ref: 'brandId'
    }, {
      name: 'colour.name',
      model: 'Colour',
      label: 'Цвет',
      ref: 'colourId'
    }, {
      name: 'highPrice',
      label: 'Розничная цена',
      //parser: parseFloat,
      compute: item => {
        return parseFloat(item['Мел_Опт_Цена']);
      }
    }, {
      name: 'lowPrice',
      label: 'Оптовая цена',
      //parser: parseFloat,
      compute: item => {
        return parseFloat(item['Спец_Цена']);
      }
    }

  ];

  angular
    .module('vseramki')
    .constant('ImportConfig', {

      Baguette: {
        BaguetteColumns,
        doneSref: 'baguettes'
      },

      Article: {
        ArticleColumns,
        doneSref: 'catalogue'
      }

    });

})();
