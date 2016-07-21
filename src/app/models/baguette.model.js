'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Baguette', Baguette)
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
            localField: 'article',
            foreignKey: 'articleId'
          }
        }
      },

      computed: {
      }

    });
  }

}());
