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
          property: 'baguette.name'
        },{
          title: 'Ширина багета',
          property: 'baguetteWidth',
          type: 'number'
        }
      ],

      Article: [

      ]

    });

})();
