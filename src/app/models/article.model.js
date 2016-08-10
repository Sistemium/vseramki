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
