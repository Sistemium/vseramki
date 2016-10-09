'use strict';

(function () {

  angular
    .module('vseramki')
    .run(Surface);

  function Surface(Schema) {

    return Schema.register({

      labels: {
        plural: 'Поверхности',
        what: 'поверхность'
      },

      name: 'Surface',

      relations: {
        hasMany: {
          Baguette: {
            localField: 'baguettes',
            foreignKey: 'surfaceId'
          }
        }
      }

    }).findAll();

  }

}());
