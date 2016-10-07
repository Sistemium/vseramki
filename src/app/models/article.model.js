'use strict';

(function () {

  function Article(Schema) {

    const totalThreshold = 100000;
    const minThreshold = 10000;

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
          },
          Screening: {
            localField: 'screening',
            localKey: 'screeningId'
          },
          BackMount: {
            localField: 'backMount',
            localKey: 'backMountId'
          }

        },
        hasMany: {
          ArticleImage: {
            localField: 'images',
            foreignKey: 'articleId'
          },
          ArticleFrameSize: {
            localField: 'articleFrameSizes',
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

        },

        multiTypeName: function () {
          if (!this.multiType) {
            return null;
          }
          return this.multiType === 'passePartout' ? 'С паcпарту' : 'Мульти-рамка';
        },

        articleFrameSizesName: function (frameSizes) {

          var fs = frameSizes || this.articleFrameSizes;

          return _.sortBy(_.filter(_.map(fs, afs => {
            if (!afs.count) {
              return '';
            }
            return (afs.count > 1 ? `${afs.count}*` : '') + afs.frameSize.name;
          })))
            .join(' + ');

        },

        stringName: function (frameSizes) {

          var baguette = this.baguette;

          var res = !baguette ? null :
            `"${baguette.brand.name}" ${_.get(this, 'frameSize.name') || ''} ${baguette.colour.name}`;

          if (this.multiType) {
            res += ` ${this.multiTypeName().toLowerCase()} (${this.articleFrameSizesName(frameSizes)})`;
          }

          return res;

        }
      }

    });

  }

  angular
    .module('vseramki')
    .service('Article', Article);


}());
