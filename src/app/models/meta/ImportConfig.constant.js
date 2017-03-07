'use strict';

(function () {

  function ImportConfigFN(Schema) {

    const BaguetteColumns = [
      {
        name: 'codeExternal',
        label: 'Код',
        required: true
      }, {
        name: 'nameExternal',
        label: 'Наименование'
      }, {
        name: 'code',
        label: 'Артикул',
        replace: false,
        required: true
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

    const ArticleColumns = [

      {
        name: 'codeExternal',
        label: 'Код (1C)',
        required: true,
        compute: item => {
          return item['Код'];
        }
      }, {
        name: 'name',
        label: 'Наименование',
        required: true
      }, {
        name: 'frameSize.name',
        model: 'FrameSize',
        label: 'Размер',
        ref: 'frameSizeId',
        required: true,
        compute: item => {

          var frameSizeReg = /\d{2,4}(\*|\x|\х)\d{2,4}/g;
          var frameSize = item['Размер'];

          if (/^\s+$/.test(frameSize)) {

            var fs = item['Наименование'].match(frameSizeReg);

            if (fs) {
              frameSize = fs[0]
            }
            else {
              frameSize = false
            }

          }

          var formattedFrameSize = false;

          if (!frameSize) {
            return null;
          } else {
            var splitters = ['x', 'х', ' ', '*'];
            _.each(splitters, function (splitter) {
              var splittedVal = frameSize.split(splitter);

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
        name: 'baguetteId',
        model: 'Baguette',
        label: 'Багет',
        compute: item => {

          var code = item['Артикул'];
          var regexp = /^X?\d{1,}(?:\*?\d{1,})$/mi;
          var rlkRegexp = /РЛК$/mi;
          var baguetteCode;

          if (code != false) {

            var divided = code.split('-');

            if (_.last(divided).length > 1) {

              // Normalized Code endings:
              // -X\d, -\d, -\d*\d

              var isNormalizedCode = regexp.test(_.last(divided));

              if (isNormalizedCode) {

                if (divided.length > 1) {
                  divided.pop();
                  baguetteCode = divided.join('-');
                } else {
                  baguetteCode = divided[0];
                }

              } else {

                var isRLK = rlkRegexp.test(divided[0]);

                if (isRLK) {
                  baguetteCode = divided[0].replace('РЛК', '');
                } else {
                  baguetteCode = divided[0];
                }

              }

              //baguetteCode = divided.join('-');

            } else {

              divided.pop();
              isNormalizedCode = regexp.test(_.last(divided));

              if (isNormalizedCode) {
                divided.pop();
                baguetteCode = divided.join('-');
              } else {
                baguetteCode = divided.join('-');
              }

            }

          } else {
            baguetteCode = null
          }

          if (baguetteCode) {

            var baguetteModel = Schema.model('Baguette');

            return _.get(_.first(baguetteModel.filter({
                where: {
                  code: {
                    likei: '%' + baguetteCode + '%'
                  }
                }
              })), 'id') || null;
          } else {
            return null;
          }

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
          return _.round(parseFloat(item['Мел_Опт_Цена']),2);
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
        doneSref: 'baguettes'
      },

      Article: {
        ArticleColumns,
        doneSref: 'catalogue'
      }

    }
  }

  angular
    .module('vseramki')
    .service('ImportConfig', ImportConfigFN);

})();
