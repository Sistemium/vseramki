'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Baguette', Baguette)
    .run(Baguette => Baguette);

  const PICTURE_TYPES = {
    sizes: 1,
    corner: 2,
    stick: 3,
  };

  function Baguette(Schema, Entity, ExportConfig, util) {

    return Schema.register({

      labels: {
        plural: 'Багет',
        what: 'багет',
        ofMany: 'Багетов'
      },

      name: 'Baguette',

      watchChanges: false,

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

      computed: {
        stickThumb: ['pictures', pictureSrc('stick')],
        cornerThumb: ['pictures', pictureSrc('corner')],
        sizesSmall: ['pictures', pictureSrc('sizes', 'small')],
      },

      methods: {

        pictureImages() {
          const res = _.map(this.pictures, (name, type) => {
            return {
              id: type,
              type,
              ord: PICTURE_TYPES[type] || 0,
              thumbnailSrc: util.pictureSrc('thumbnails')(name),
              smallSrc: util.pictureSrc('small')(name),
              largeSrc: util.pictureSrc('large')(name),
            }
          });
          return _.orderBy(res, 'ord');
        },

        activePhoto() {
          const photo = _.get(this, 'images[0]');
          return photo ? photo.thumbnailSrc : '/images/placeholder.png';
        },

        stringName() {

          const names = [
            this.brand ? '"' + this.brand.name + '"' : this.code
          ];

          if (this.colour) {
            names.push(this.colour.name.toLocaleLowerCase());
          }

          if (this.surface) {
            names.push(this.surface.name.toLocaleLowerCase());
          }

          if (this.lastName) {
            names.push(this.lastName);
          }

          return names.join(' ');

        },

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

    function pictureSrc(type, size = 'thumbnails') {
      return pictures => {
        if (!pictures) {
          return '/images/placeholder.png';
        }
        return util.pictureSrc(size)(pictures[type]);
      }
    }

  }

}());
