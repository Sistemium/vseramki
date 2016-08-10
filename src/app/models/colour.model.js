'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Colour', Colour)
    .run(function (Colour) {
      Colour.findAll();
    })
  ;

  function Colour(Schema) {

    return Schema.register({

      name: 'Colour',

      relations: {
        hasMany: {
          Baguette: {
            localField: 'baguettes',
            foreignKey: 'colourId'
          }
        }
      }

    });

  }

}());
