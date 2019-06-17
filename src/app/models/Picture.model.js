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
        thumbnailSrc: ['name', util.pictureSizeSrc('thumbnails')],
        smallSrc: ['name', util.pictureSizeSrc('small')],
      },

      methods: {
        hasArticles() {
          const {Article, Baguette} = Schema.models();
          if (this.type === 'frame') {
            return Article.filter({code: this.article}).length;
          }
          return Baguette.filter({code: this.article}).length;
        },
      },

    });

  }

}());
