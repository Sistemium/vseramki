'use strict';

(function () {

  angular
    .module('vseramki')
    .service('BackMount', BackMount)
    .run(function (BackMount) {
      BackMount.findAll();
    })
  ;

  function BackMount(Schema) {

    return Schema.register({

      labels: {
        plural: 'Крепления задника',
        what: 'крепление задника'
      },

      name: 'BackMount',

      relations: {
        hasMany: {
          Article: {
            localField: 'articles',
            foreignKey: 'backMountId'
          }
        }
      }

    });

  }

}());
