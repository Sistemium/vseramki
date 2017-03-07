'use strict';

(function () {

  angular
    .module('vseramki')
    .run(ArticleImage)
  ;

  function ArticleImage(Schema) {

    return Schema.register({

      name: 'ArticleImage',
      relations: {
        hasOne: {
          Article: {
            localField: 'article',
            localKey: 'articleId'
          }
        }
      },

      watchChanges: false

      // thumbnailSrc, smallSrc, largeSrc

    });

  }

}());
