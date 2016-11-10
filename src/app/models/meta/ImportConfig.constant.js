'use strict';

(function () {

  angular
    .module('vseramki')
    .constant('ExportConfig', {

      Baguette: [
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
          name: 'materialName',
          label: 'Материал',
          ref: 'materialId'
        }, {
          name: 'brandName',
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
      ]

    });

})();
