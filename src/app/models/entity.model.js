'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Entity', Entity)
    .run(function (Entity) {
      Entity.findAll();
    })
  ;

  function Entity(Schema) {

    return Schema.register({

      name: 'Entity'

    });

  }

}());
