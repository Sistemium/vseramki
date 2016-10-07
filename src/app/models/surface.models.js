'use strict';

(function () {

  angular
    .module('vseramki')
    .run(Surface);

  function Surface(Schema) {

    return Schema.register({

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
