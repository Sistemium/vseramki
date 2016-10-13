'use strict';

(function () {

  angular
    .module('vseramki')
    .run(Baguette)
    .service('Baguette',function(Schema){
      return Schema.model('Baguette');
    })
  ;

  function Baguette(Schema, Entity) {

    return Schema.register({

      labels: {
        plural: 'Багет',
        what: 'багет'
      },

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
          },
          Surface: {
            localField: 'surface',
            localKey: 'surfaceId'
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
          },
          BaguetteColour: {
            localField: 'colours',
            foreignKey: 'baguetteId'
          }
        }

      },

      methods: {

        stringName: function () {

          var names = [
            this.brand ? '"' + this.brand.name + '"' : this.code
          ];

          if (this.surface){
            names.push(this.surface.name);
          }

          if (this.colour){
            names.push(this.colour.name);
          }

          if (this.lastName) {
            names.push(this.lastName);
          }

          return names.join(' ');

        }
      },

      beforeCreateInstance: function (model, attrs) {
        attrs.id || _.defaults(attrs, {
          colourId: Entity.getDefault('Colour'),
          surfaceId: Entity.getDefault('Surface'),
          brandId: Entity.getDefault('Brand'),
          materialId: Entity.getDefault('Material')
        });
      }

    });
  }

}());
