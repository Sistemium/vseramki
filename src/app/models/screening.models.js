'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Screening', Screening)
    .run(function (Screening) {
      Screening.findAll();
    })
  ;

  function Screening(Schema) {

    return Schema.register({

      labels: {
        plural: 'Вставки',
        what: 'вставку'
      },

      name: 'Screening',

      relations: {
        hasMany: {
          Article: {
            localField: 'articles',
            foreignKey: 'screeningId'
          }
        }
      }

    });

  }

}());
