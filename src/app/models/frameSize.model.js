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

      name: 'FrameSize',

      relations: {
        hasMany: {
          Article: {
            localField: 'articles',
            foreignKey: 'frameSizeId'
          }
        }
      }

    });

  }

}());
