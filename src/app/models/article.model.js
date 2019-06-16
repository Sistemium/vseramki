'use strict';

(function () {

  function Article(Schema, Entity, ExportConfig, util) {

    const totalThreshold = 100000;
    const minThreshold = 10000;

    return Schema.register({

      labels: {
        plural: 'Рамки',
        what: 'рамку',
        ofMany: 'Рамок'
      },

      name: 'Article',

      watchChanges: false,

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

      /**
       * @property multiType
       * @property frameSize
       * @property lowPrice
       * @property highPrice
       */

      meta: {
        exportConfig: ExportConfig.Article
      },

      computed: {
        thumb: ['pictures', util.pictureSrc('frame')],
      },

      methods: {

        activePhoto() {
          return _.get(this.pictures, 'frame') ? this.thumb : _.get(this, 'baguette.cornerThumb');
        },

        pictureImages() {
          const images = _.assign({}, this.pictures, _.get(this.baguette, 'pictures'));
          return util.pictureImages(images);
        },

        discountedPrice(total) {

          const useTotal = total < totalThreshold ? total : totalThreshold;

          if (!this.lowPrice || useTotal <= minThreshold) {
            return this.highPrice;
          }

          const k = (useTotal - minThreshold) / (totalThreshold - minThreshold);

          return Math.floor(100.0 * (
            this.highPrice - (this.highPrice - this.lowPrice) * k
          )) / 100.0;

        },

        multiTypeName: function () {
          if (!this.multiType) {
            return null;
          }
          return this.multiType === 'passePartout' ? 'С паcпарту' : 'Мульти-рамка';
        },

        articleFrameSizesName: function (frameSizes) {

          const fs = frameSizes || this.articleFrameSizes;

          return _.sortBy(_.filter(_.map(fs, afs => {
            if (!afs.count) {
              return '';
            }
            return (afs.count > 1 ? `${afs.count}*` : '') + afs.frameSize.name;
          })))
            .join(' + ');

        },

        secondName: function () {
          const name = this.multiTypeName();

          return name ? `${this.multiTypeName()} (${this.articleFrameSizesName()})` : '';
        },

        stringName: function (frameSizes) {

          const baguette = this.baguette;

          const brandName = _.get(baguette, 'brand.name');

          let res = brandName ? '' : 'Рамка';
          res += ` ${_.get(baguette, 'name') || ''} ${_.get(this, 'frameSize.name') || ''}`;

          if (this.multiType) {
            res += ` ${this.multiTypeName().toLowerCase()} (${this.articleFrameSizesName(frameSizes)})`;
          }

          return _.trim(res);

        }
      },

      beforeCreateInstance: function (model, attrs) {
        attrs.id || _.defaults(attrs, {
          frameSizeId: Entity.getDefault('FrameSize'),
          screeningId: Entity.getDefault('Screening'),
          backMountId: Entity.getDefault('BackMount')
        });
      }

    });

  }

  angular
    .module('vseramki')
    .service('Article', Article)
    .run((Article, AuthHelper) => {

      let hasUser = AuthHelper.hasUser();

      if (hasUser) {
        hasUser.then(() => {
          Article.findAll({limit: 3000});
        });
      }

    });


}());
