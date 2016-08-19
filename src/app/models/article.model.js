'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Article', Article)
  ;

  function Article(Schema) {

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
      }

    });

  }

}());
