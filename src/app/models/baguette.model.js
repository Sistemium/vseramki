'use strict';

(function () {

  angular
    .module('vseramki')
    .run(Baguette)
    .service('Baguette',function(Schema){
      return Schema.model('Baguette');
    })
  ;

  function Baguette(Schema) {

    return Schema.register({

      name: 'Baguette',

      relations: {
        hasOne: {
          Colour: {
            localField: 'colour',
            localKey: 'colourId'
          },
          Brand: {
            localField: 'brand',
            localKey: 'brandId'
          },
          Material: {
            localField: 'material',
            localKey: 'materialId'
          }
        },
        hasMany: {
          Article: {
            localField: 'articles',
            foreignKey: 'baguetteId'
          },
          BaguetteImage: {
            localField: 'images',
            foreignKey: 'baguetteId'
          }

        }
      }

    });
  }

}());
