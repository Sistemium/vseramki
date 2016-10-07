'use strict';

(function () {

  angular
    .module('vseramki')
    .run(BaguetteColour);

  function BaguetteColour(Schema) {

    return Schema.register({

      name: 'BaguetteColour',
      relations: {
        hasOne: {
          Baguette: {
            localField: 'baguette',
            localKey: 'baguetteId'
          },
          Colour: {
            localField: 'colour',
            localKey: 'colourId'
          }
        }
      }

    }).findAll();

  }

}());
