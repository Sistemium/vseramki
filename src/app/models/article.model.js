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
        discountedPrice: function (total) {
          total = total < totalThreshold ? total : totalThreshold;

          // if lowPrice in not specified

          if (this.lowPrice == null) {
            this.lowPrice = this.highPrice;
          }

          if ((total <= 0) && (total <= minThreshold)) {
            total = 0;
          }

          return Math.floor(100.0 * (this.highPrice - (this.highPrice - this.lowPrice) * Math.pow(total / totalThreshold, 2))) / 100.0;

        }
      }

    });

  }

}());
