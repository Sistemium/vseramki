'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Article', Article)
  ;

  function Article(Schema) {

    var totalThreshold = 100000;
    var minThreshold = 10000;

    return Schema.register({

      name: 'Article',

      maxThreshold: () => totalThreshold,
      minThreshold: () => minThreshold,

      relations: {
        hasOne: {
          Cart: {
            localField: 'inCart',
            foreignKey: 'articleId'
          },
          Baguette: {
            localField: 'baguette',
            localKey: 'baguetteId'
          },
          FrameSize: {
            localField: 'frameSize',
            localKey: 'frameSizeId'
          },
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
          ArticleImage: {
            localField: 'images',
            foreignKey: 'articleId'
          }
        }
      },

      methods: {

        activePhoto: function () {
          var photo = _.get(this, 'images[0]') || _.get(this, 'baguette.images[0]');
          return photo ? photo.thumbnailSrc : '/images/question_mark.png';
        },

        discountedPrice: function (total) {

          var useTotal = total < totalThreshold ? total : totalThreshold;

          if (!this.lowPrice || useTotal <= minThreshold) {
            return this.highPrice;
          }

          return Math.floor(100.0 * (this.highPrice - (this.highPrice - this.lowPrice) * Math.pow(useTotal / totalThreshold, 2))) / 100.0;

        }
      }

    });

  }

}());
