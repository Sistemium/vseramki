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
      }

    });

  }

}());
