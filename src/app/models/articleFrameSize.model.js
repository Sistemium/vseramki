'use strict';

(function () {

  angular.module('vseramki')
    .service('ArticleFrameSize', ArticleFrameSize)
    .run(ArticleFrameSize => ArticleFrameSize.findAll());

  function ArticleFrameSize(Schema) {

    return Schema.register({

      name: 'ArticleFrameSize',

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

}());
