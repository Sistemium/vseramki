'use strict';

(function () {

  angular
    .module('vseramki')
    .service('FrameSize', FrameSize)
    .run(function (FrameSize) {
      FrameSize.findAll();
    })
  ;

  function FrameSize(Schema) {

    return Schema.register({

      labels: {
        plural: 'Размеры',
        what: 'размер'
      },

      name: 'FrameSize',

      relations: {
        hasMany: {
          Article: {
            localField: 'articles',
            foreignKey: 'frameSizeId'
          },
          ArticleFrameSize: {
            localField: 'articleFrameSizes',
            foreignKey: 'frameSizeId'
          }
        }
      }

    });

  }

}());
