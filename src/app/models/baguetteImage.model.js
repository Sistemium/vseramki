'use strict';

(function () {

  angular
    .module('vseramki')
    .run(BaguetteImage)
  ;

  function BaguetteImage(Schema) {

    return Schema.register({

      name: 'BaguetteImage',
      relations: {
        hasOne: {
          Baguette: {
            localField: 'baguette',
            localKey: 'baguetteId'
          }
        }
      },

      watchChanges: false

    });

  }

}());
