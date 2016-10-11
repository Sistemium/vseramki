'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Material', Material)
    .run(function (Material) {
      Material.findAll();
    })
  ;

  function Material(Schema) {

    return Schema.register({

      labels: {
        plural: 'Материалы',
        what: 'материал'
      },

      name: 'Material',

      relations: {
        hasMany: {
          //Article: {
          //  localField: 'articles',
          //  foreignKey: 'materialId'
          //},
          Baguette: {
            localField: 'baguettes',
            foreignKey: 'materialId'
          }
        }
      }

    });

  }

}());
