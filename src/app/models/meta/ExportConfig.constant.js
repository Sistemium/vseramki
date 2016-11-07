'use strict';

(function () {

  angular
    .module('vseramki')
    .constant('ExportConfig', {

      Baguette: [
        {
          title: 'Наименование',
          property: 'name'
        },{
          title: 'Артикул',
          property: 'code'
        },{
          title: 'Материал',
          property: 'material.name'
        },{
          title: 'Ширина багета',
          property: 'borderWidth',
          type: 'number'
        }
      ],

      Article: [

      ]

    });

})();
