'use strict';

(function () {

  function ImportConfigFN(Schema) {

    const baguetteModel = Schema.model('Baguette');

    const BaguetteColumns = [
      {
        name: 'codeExternal',
        label: 'Код',
        required: true,
        parser: _.trim
      }, {
        name: 'nameExternal',
        label: 'Наименование',
        required: true
      }, {
        name: 'name',
        replace: false,
        compute: item => {
          return item['Наименование']
        }
      }, {
        name: 'code',
        label: 'Артикул',
        // replace: false
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
        ref: 'materialId',
        required: true
      }, {
        name: 'brand.name',
        model: 'Brand',
        label: 'Бренд',
        ref: 'brandId',
        replace: false,
        compute: item => {

          const name = item['Наименование'];
          if (!name) {
            return null;
          }

          let re = /"(.+)"/;
          let res = _.last(name.match(re));

          if (res) {
            return res;
          }

          re = / ([А-Я][а-я]+) /;
          res = _.last(name.match(re));

          return _.upperFirst(res);

        }
      }
    ];

    const ArticleColumns = [
      {
        name: 'code',
        label: 'Артикул',
        required: true,
        parser: _.trim
      }, {
        name: 'codeExternal',
        label: 'Код',
        required: true,
        parser: _.trim
      }, {
        name: 'nameExternal',
        label: 'Наименование',
        required: true
      }, {
        name: 'name',
        replace: false,
        compute: item => {
          return item['Наименование']
        }
      }, {
        name: 'frameSize.name',
        model: 'FrameSize',
        label: 'Размер',
        ref: 'frameSizeId',
        required: true,
        compute: item => {

          const frameSizeReg = /\d{2,4}(\*|\x|\х)\d{2,4}/g;
          let frameSize = item['Размер'];

          if (/^\s+$/.test(frameSize)) {

            const fs = item['Наименование'].match(frameSizeReg);

            if (fs) {
              frameSize = fs[0]
            }
            else {
              frameSize = false
            }

          }

          let formattedFrameSize = false;

          if (!frameSize) {
            return null;
          } else {
            const splitters = ['x', 'х', ' ', '*'];
            _.each(splitters, function (splitter) {
              const splittedVal = frameSize.split(splitter);

              if (splittedVal[0] * splittedVal[1] > 0) {
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
        name: 'baguette.codeExternal',
        model: 'Baguette',
        ref: 'baguetteId',
        label: 'Багет',
        required: true,
        compute: item => {

          let code = item['Артикул'];

          if (!code) return;

          let match = code.match(/(.+)(РД|РП)\d+$/i);

          if (!match) return;

          let baguetteCode = match[1];

          let baguettes = baguetteModel.filter({
            where: {
              code: {
                likei: baguetteCode
              }
            }
          });

          if (baguettes.length !== 1) return;

          return _.get(baguettes[0], 'codeExternal');

        }
      }, {
        name: 'backMount.name',
        model: 'BackMount',
        label: 'Крепление задника',
        ref: 'backMountId'
      }, {
        name: 'highPrice',
        label: 'Розн. цена',
        //parser: parseFloat,
        compute: item => {
          return _.round(parseFloat(item['Мел_Опт_Цена']) || parseFloat(item['Спец_Цена']) * 1.15, 2);
        }
      }, {
        name: 'lowPrice',
        label: 'Опт. цена',
        //parser: parseFloat,
        compute: item => {
          return _.round(parseFloat(item['Спец_Цена']),2);
        }
      }
    ];

    return {

      Baguette: {
        BaguetteColumns,
        doneSref: 'baguettes',
        primaryKey: 'codeExternal'
      },

      Article: {
        ArticleColumns,
        doneSref: 'catalogue',
        primaryKey: 'codeExternal'
      }

    }
  }

  angular
    .module('vseramki')
    .service('ImportConfig', ImportConfigFN);

})();
