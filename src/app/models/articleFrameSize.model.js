'use strict';

(function () {

  function ArticleFrameSize(Schema) {

    return Schema.register({

      name: 'ArticleFrameSize',

      labels: {
        // plural: 'Рамки',
        // what: 'рамку',
        ofMany: 'Доп. Рамок'
      },

      relations: {
        hasOne: {
          Article: {
            localField: 'article',
            localKey: 'articleId'
          },
          FrameSize: {
            localField: 'frameSize',
            localKey: 'frameSizeId'
          }
        }
      }

    });

  }

  angular.module('vseramki')
    .service('ArticleFrameSize', ArticleFrameSize)
    .run(ArticleFrameSize => ArticleFrameSize.findAll());

}());
