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
        name: ['colour', 'material', 'brand', function(colour, material, brand) {
          return [_.get(colour,'name'), _.get(brand,'name'), _.get(material,'name')].join('-');
        }]
      }

    });
  }

}());
