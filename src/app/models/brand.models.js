'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Brand', Brand)
    .run(function (Brand) {
      Brand.findAll();
    })
  ;

  function Brand(Schema) {

    return Schema.register({

      labels: {
        plural: 'Бренды',
        what: 'бренд'
      },

      name: 'Brand',

      relations: {
        hasMany: {
          Baguette: {
            localField: 'baguettes',
            foreignKey: 'brandId'
          }
        }
      }

    });

  }

}());
