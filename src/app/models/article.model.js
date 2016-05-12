'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Article',Article)
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
          FrameSize: {
            localField: 'frameSize',
            localKey: 'frameSizeId'
          }
        }
      }

    });

  }

}());
