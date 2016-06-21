'use strict';

(function () {

  angular
    .module('vseramki')
    .service('ArticleImage',ArticleImage)
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
      }

      // thumbnailSrc, smallSrc, largeSrc

    });

  }

}());
