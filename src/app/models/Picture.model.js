'use strict';

(function () {

  angular
    .module('vseramki')
    .run(Picture);

  function Picture(Schema, util) {

    return Schema.register({

      labels: {
        plural: 'Картинки',
        what: 'катринку',
        gender: 'female'
      },

      name: 'Picture',

      relations: {
        hasMany: {}
      },

      computed: {
        thumbnailSrc: ['name', util.pictureSrc('thumbnails')],
        smallSrc: ['name', util.pictureSrc('small')],
      },

    });

  }

}());
