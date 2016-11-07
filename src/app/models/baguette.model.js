'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Baguette', Baguette)
    .run(Baguette => Baguette);

  function Baguette(Schema, Entity, ExportConfig) {

    return Schema.register({

      labels: {
        plural: 'Багет',
        what: 'багет',
        ofMany: 'Багетов'
      },

      name: 'Baguette',

      meta: {
        exportConfig: ExportConfig.Baguette
      },

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

        activePhoto: function () {
          var photo = _.get(this, 'images[0]');
          return photo ? photo.thumbnailSrc : '/images/placeholder.png';
        },

        stringName: function () {

          var names = [
            this.brand ? '"' + this.brand.name + '"' : this.code
          ];

          if (this.colour){
            names.push(this.colour.name.toLocaleLowerCase());
          }

          if (this.surface){
            names.push(this.surface.name.toLocaleLowerCase());
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
