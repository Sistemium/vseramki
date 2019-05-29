'use strict';

(function () {

  angular
    .module('vseramki')
    .run(Picture);

  function Picture(Schema) {

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
        thumbnailSrc: ['name', src('thumbnails')],
        smallSrc: ['name', src('small')],
      },

    });

    function src(size) {
      return name => escapeUrl(`https://s3-eu-west-1.amazonaws.com/vseramki/${size}/${name}`);
    }

    function escapeUrl(url) {
      return url.replace(/\+/g, '%2B');
    }

  }

}());
