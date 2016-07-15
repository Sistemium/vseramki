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

      name: 'Material',

      relations: {
        hasMany: {
          Article: {
            localField: 'baguettes',
            foreignKey: 'materialId'
          }
        }
      }

    });

  }

}());
